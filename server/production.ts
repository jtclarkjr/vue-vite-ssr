import { extname, resolve, sep } from 'node:path'

import { handleApiRequest } from './api'
import { renderDocument } from './document'
import { createUnhandledRequestResponse } from './observability'

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

const port = Number(process.env.PORT ?? 8080)
const clientRoot = resolve(import.meta.dir, '../dist/client')
const template = await Bun.file(resolve(clientRoot, 'index.html')).text()
const serverEntryUrl = new URL('../dist/server/entry-server.js', import.meta.url)
// The build command always produces the SSR entry with the declared public contract.
// oxlint-disable-next-line typescript/no-unsafe-type-assertion
const { render } = (await import(serverEntryUrl.href)) as RenderModule

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function resolveAsset(pathname: string): string | null {
  if (!pathname.startsWith('/assets/')) return null
  const assetPath = resolve(clientRoot, `.${decodeURIComponent(pathname)}`)
  return assetPath.startsWith(`${clientRoot}${sep}`) ? assetPath : null
}

Bun.serve({
  hostname: '0.0.0.0',
  port,
  async fetch(request) {
    const startedAt = performance.now()
    try {
      const apiResponse = await handleApiRequest(request)
      if (apiResponse) return apiResponse

      const url = new URL(request.url)
      const assetPath = resolveAsset(url.pathname)
      if (assetPath) {
        const file = Bun.file(assetPath)
        if (!(await file.exists())) return new Response('Not found', { status: 404 })
        return new Response(file, {
          headers: {
            'cache-control': 'public, max-age=31536000, immutable',
            'content-type': contentTypes[extname(assetPath)] ?? 'application/octet-stream',
          },
        })
      }

      const routeUrl = `${url.pathname}${url.search}`
      const result = await render(routeUrl, { origin: url.origin })
      return new Response(renderDocument(template, result.html, result.state), {
        status: result.status,
        headers: {
          'cache-control': 'no-cache',
          'content-type': 'text/html; charset=utf-8',
        },
      })
    } catch (error) {
      return createUnhandledRequestResponse(request, error, { startedAt })
    }
  },
})

console.log(`Production SSR server running at http://0.0.0.0:${port}`)
