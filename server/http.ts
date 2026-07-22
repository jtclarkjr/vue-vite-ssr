import type { IncomingMessage, ServerResponse } from 'node:http'

export async function toWebRequest(request: IncomingMessage): Promise<Request> {
  const forwardedProtocol = request.headers['x-forwarded-proto']
  const protocol = Array.isArray(forwardedProtocol)
    ? (forwardedProtocol[0] ?? 'http')
    : (forwardedProtocol ?? 'http')
  const host = request.headers.host ?? 'localhost'
  const url = `${protocol}://${host}${request.url ?? '/'}`
  const chunks: Uint8Array[] = []

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    for await (const chunk of request) {
      chunks.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk)
    }
  }

  const body =
    chunks.length > 0 ? new Blob(chunks.map((chunk) => Uint8Array.from(chunk).buffer)) : undefined
  const headers = new Headers()
  for (const [key, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) value.forEach((item) => headers.append(key, item))
    else if (value !== undefined) headers.set(key, value)
  }
  return new Request(url, {
    method: request.method,
    headers,
    body,
  })
}

export async function writeWebResponse(response: Response, output: ServerResponse) {
  output.statusCode = response.status
  response.headers.forEach((value, key) => output.setHeader(key, value))
  output.end(Buffer.from(await response.arrayBuffer()))
}
