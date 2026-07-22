import { createApiRequestHandler } from './observability'

const json = (data: unknown, init: ResponseInit = {}) => {
  const headers = new Headers(init.headers)
  headers.set('cache-control', 'no-store')
  return Response.json(data, { ...init, headers })
}

const routeApiRequest = async (request: Request): Promise<Response> => {
  const url = new URL(request.url)

  if (request.method === 'GET' && url.pathname === '/api/health') {
    return json({ status: 'ok', service: 'vue-vite-ssr' })
  }

  if (request.method === 'GET' && url.pathname === '/api/example') {
    return json({
      message: 'This response came from the shared Bun API handler.',
      renderedAt: new Date().toISOString(),
    })
  }

  return json({ message: 'API route not found' }, { status: 404 })
}

export const handleApiRequest = createApiRequestHandler(routeApiRequest)
