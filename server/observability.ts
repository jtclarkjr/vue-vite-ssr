import { randomUUID } from 'node:crypto'

type LogLevel = 'info' | 'warn' | 'error'
type RequestOutcome = 'success' | 'handled_error' | 'unhandled_error'

export type ApiRouteHandler = (request: Request) => Promise<Response> | Response

export interface RequestDetails {
  method: string
  url: string
}

export interface UnhandledRequestOptions {
  exposeError?: boolean
  startedAt?: number
}

interface SerializedError {
  name: string
  message: string
  stack?: string
}

interface RequestLogFields {
  event: 'api.request' | 'http.request.unhandled'
  requestId: string
  method: string
  endpoint: string
  status: number
  durationMs: number
  outcome: RequestOutcome
  error?: SerializedError
}

const durationSince = (startedAt: number) =>
  Math.round(Math.max(0, performance.now() - startedAt) * 100) / 100

const writeLog = (level: LogLevel, fields: RequestLogFields) => {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    ...fields,
  })

  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.info(line)
}

export function normalizeError(value: unknown): Error {
  if (value instanceof Error) return value

  if (typeof value === 'string') return new Error(value)

  try {
    return new Error(JSON.stringify(value) ?? 'Unknown error')
  } catch {
    return new Error('Unknown error')
  }
}

const serializeError = (error: Error): SerializedError => ({
  name: error.name,
  message: error.message,
  ...(error.stack ? { stack: error.stack } : {}),
})

const levelForStatus = (status: number): LogLevel => {
  if (status >= 500) return 'error'
  if (status >= 400) return 'warn'
  return 'info'
}

const responseWithRequestId = (response: Response, requestId: string) => {
  const headers = new Headers(response.headers)
  headers.set('x-request-id', requestId)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

const internalServerErrorResponse = (requestId: string) =>
  Response.json(
    {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        requestId,
      },
    },
    {
      status: 500,
      headers: {
        'cache-control': 'no-store',
        'x-request-id': requestId,
      },
    },
  )

export function createApiRequestHandler(route: ApiRouteHandler) {
  return async (request: Request): Promise<Response | null> => {
    const url = new URL(request.url)
    if (!url.pathname.startsWith('/api/')) return null

    const startedAt = performance.now()
    const requestId = randomUUID()

    try {
      const response = responseWithRequestId(await route(request), requestId)
      writeLog(levelForStatus(response.status), {
        event: 'api.request',
        requestId,
        method: request.method,
        endpoint: url.pathname,
        status: response.status,
        durationMs: durationSince(startedAt),
        outcome: response.status >= 400 ? 'handled_error' : 'success',
      })
      return response
    } catch (value) {
      const error = normalizeError(value)
      writeLog('error', {
        event: 'api.request',
        requestId,
        method: request.method,
        endpoint: url.pathname,
        status: 500,
        durationMs: durationSince(startedAt),
        outcome: 'unhandled_error',
        error: serializeError(error),
      })
      return internalServerErrorResponse(requestId)
    }
  }
}

export function createUnhandledRequestResponse(
  request: RequestDetails,
  value: unknown,
  options: UnhandledRequestOptions = {},
): Response {
  const url = new URL(request.url)
  const requestId = randomUUID()
  const error = normalizeError(value)
  const isApiRequest = url.pathname.startsWith('/api/')

  writeLog('error', {
    event: isApiRequest ? 'api.request' : 'http.request.unhandled',
    requestId,
    method: request.method,
    endpoint: url.pathname,
    status: 500,
    durationMs: durationSince(options.startedAt ?? performance.now()),
    outcome: 'unhandled_error',
    error: serializeError(error),
  })

  if (isApiRequest) return internalServerErrorResponse(requestId)

  return new Response(
    options.exposeError ? (error.stack ?? error.message) : 'Internal server error',
    {
      status: 500,
      headers: {
        'cache-control': 'no-store',
        'content-type': 'text/plain; charset=utf-8',
        'x-request-id': requestId,
      },
    },
  )
}
