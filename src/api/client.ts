export interface ApiClientOptions {
  baseUrl?: string
  fetch?: typeof fetch
  defaultHeaders?: HeadersInit
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly data: unknown,
    readonly code?: string,
    readonly requestId?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface ApiClient {
  request<T>(path: string, options?: ApiRequestOptions): Promise<T>
  get<T>(path: string, options?: ApiRequestOptions): Promise<T>
  post<T>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<T>
  put<T>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<T>
  patch<T>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<T>
  delete<T>(path: string, options?: ApiRequestOptions): Promise<T>
}

const getDefaultBaseUrl = () =>
  typeof window === 'undefined' ? 'http://localhost' : window.location.origin

const isBodyInit = (value: unknown): value is BodyInit =>
  typeof value === 'string' ||
  value instanceof Blob ||
  value instanceof FormData ||
  value instanceof URLSearchParams ||
  value instanceof ArrayBuffer ||
  ArrayBuffer.isView(value)

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getString = (value: unknown, key: string) =>
  isRecord(value) && typeof value[key] === 'string' ? value[key] : undefined

export function createApiClient(options: ApiClientOptions = {}): ApiClient {
  const fetchImplementation = options.fetch ?? globalThis.fetch

  const request = async <T>(path: string, requestOptions: ApiRequestOptions = {}): Promise<T> => {
    const url = new URL(path, options.baseUrl ?? getDefaultBaseUrl())
    const headers = new Headers(options.defaultHeaders)
    new Headers(requestOptions.headers).forEach((value, key) => headers.set(key, value))

    let body: BodyInit | undefined
    if (requestOptions.body !== undefined) {
      if (isBodyInit(requestOptions.body)) {
        body = requestOptions.body
      } else {
        body = JSON.stringify(requestOptions.body)
        if (!headers.has('content-type')) headers.set('content-type', 'application/json')
      }
    }

    const response = await fetchImplementation(url, { ...requestOptions, headers, body })
    const contentType = response.headers.get('content-type') ?? ''
    const data: unknown =
      response.status === 204
        ? undefined
        : contentType.includes('application/json')
          ? await response.json()
          : await response.text()

    if (!response.ok) {
      const nestedError = isRecord(data) ? data.error : undefined
      const message =
        getString(data, 'message') ??
        getString(nestedError, 'message') ??
        `Request failed with status ${response.status}`
      const code = getString(nestedError, 'code') ?? getString(data, 'code')
      const requestId =
        getString(nestedError, 'requestId') ??
        getString(data, 'requestId') ??
        response.headers.get('x-request-id') ??
        undefined
      throw new ApiError(message, response.status, data, code, requestId)
    }

    // The caller supplies the response contract; runtime schema validation can be added per domain.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return data as T
  }

  return {
    request,
    get: (path, requestOptions) => request(path, { ...requestOptions, method: 'GET' }),
    post: (path, body, requestOptions) =>
      request(path, { ...requestOptions, method: 'POST', body }),
    put: (path, body, requestOptions) => request(path, { ...requestOptions, method: 'PUT', body }),
    patch: (path, body, requestOptions) =>
      request(path, { ...requestOptions, method: 'PATCH', body }),
    delete: (path, requestOptions) => request(path, { ...requestOptions, method: 'DELETE' }),
  }
}

export const apiClientKey: InjectionKey<ApiClient> = Symbol('api-client')

export function useApi(): ApiClient {
  const api = inject(apiClientKey)
  if (!api) throw new Error('API client is not installed')
  return api
}
