import { createServer as createHttpServer } from 'node:http'

import { createServer as createViteServer, type ViteDevServer } from 'vite-plus'

import { handleApiRequest } from './api'
import { renderDocument } from './document'
import { toWebRequest, writeWebResponse } from './http'

interface RenderModule {
  render: (
    url: string,
    options: { origin: string },
  ) => Promise<{
    html: string
    state: unknown
    status: number
  }>
}

const port = Number(process.env.PORT ?? 5173)

const server = createHttpServer((request, response) => {
  void (async () => {
    const webRequest = await toWebRequest(request)
    const apiResponse = await handleApiRequest(webRequest)
    if (apiResponse) return writeWebResponse(apiResponse, response)

    vite.middlewares(request, response, () => {
      void (async () => {
        try {
          const requestUrl = new URL(webRequest.url)
          const routeUrl = `${requestUrl.pathname}${requestUrl.search}`
          const sourceTemplate = await Bun.file('index.html').text()
          const template = await vite.transformIndexHtml(routeUrl, sourceTemplate)
          // Vite loads the local SSR entry whose public contract is declared above.
          // oxlint-disable-next-line typescript/no-unsafe-type-assertion
          const { render } = (await vite.ssrLoadModule('/src/entry-server.ts')) as RenderModule
          const result = await render(routeUrl, { origin: requestUrl.origin })

          response.statusCode = result.status
          response.setHeader('content-type', 'text/html; charset=utf-8')
          response.setHeader('cache-control', 'no-store')
          response.end(renderDocument(template, result.html, result.state))
        } catch (error) {
          const normalizedError = error instanceof Error ? error : new Error(String(error))
          vite.ssrFixStacktrace(normalizedError)
          console.error(normalizedError)
          response.statusCode = 500
          response.setHeader('content-type', 'text/plain; charset=utf-8')
          response.end(normalizedError.stack)
        }
      })()
    })
  })().catch((error: unknown) => {
    console.error(error)
    response.statusCode = 500
    response.end('Internal server error')
  })
})

const vite: ViteDevServer = await createViteServer({
  server: { middlewareMode: true, hmr: { server } },
  appType: 'custom',
})

server.listen(port, '0.0.0.0', () => {
  console.log(`SSR development server running at http://localhost:${port}`)
})

const shutdown = () => {
  server.close()
  void vite.close()
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
