import { defineMiddleware } from 'void'

declare module 'void' {
  interface CloudContextVariables {
    notFoundPage?: boolean
  }
}

export default defineMiddleware(async (c, next) => {
  await next()

  // Void 1.1.11 does not carry a loader's c.status() into rendered page responses.
  if (c.get('notFoundPage') === true && c.res.status === 200) {
    c.res = new Response(c.req.method === 'HEAD' ? null : c.res.body, {
      status: 404,
      statusText: 'Not Found',
      headers: c.res.headers,
    })
  }
})
