import { uneval } from 'devalue'
import { fetch as nitroFetch } from 'nitro'
import type { StateTree } from 'pinia'
import { renderToString, type SSRContext } from 'vue/server-renderer'

import { createApplication } from './app'

export interface RenderOptions {
  origin: string
  fetch?: typeof fetch
}

export interface RenderResult {
  html: string
  state: StateTree
  status: number
  modules: string[]
}

type FetchCall = (...arguments_: Parameters<typeof fetch>) => ReturnType<typeof fetch>

const createServerFetch = (origin: string): typeof fetch => {
  const fetchCall: FetchCall = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const request = new Request(input, init)
    const requestUrl = new URL(request.url)

    if (requestUrl.origin !== origin) return globalThis.fetch(request)

    const body =
      request.method === 'GET' || request.method === 'HEAD'
        ? undefined
        : await request.arrayBuffer()

    return nitroFetch(`${requestUrl.pathname}${requestUrl.search}`, {
      method: request.method,
      headers: request.headers,
      body,
      signal: request.signal,
    })
  }

  return Object.assign(fetchCall, { preconnect: globalThis.fetch.preconnect })
}

export async function render(url: string, options: RenderOptions): Promise<RenderResult> {
  const { app, router, pinia } = createApplication({
    ssr: true,
    apiBaseUrl: options.origin,
    fetch: options.fetch,
  })

  await router.push(url)
  await router.isReady()

  const context: SSRContext = {}
  const html = await renderToString(app, context)

  return {
    html,
    state: pinia.state.value,
    status: router.currentRoute.value.meta.status === 404 ? 404 : 200,
    modules: context.modules ? [...context.modules] : [],
  }
}

const rendererResponses = new WeakMap<Request, Promise<Response>>()

const createRendererResponse = async (request: Request): Promise<Response> => {
  const url = new URL(request.url)
  const result = await render(`${url.pathname}${url.search}`, {
    origin: url.origin,
    fetch: createServerFetch(url.origin),
  })
  const body = `<div id="app">${result.html}</div><script>window.__PINIA_STATE__=${uneval(result.state)}</script>`

  return new Response(body, {
    status: result.status,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'text/html; charset=utf-8',
    },
  })
}

export default {
  async fetch(request: Request): Promise<Response> {
    const response = rendererResponses.get(request) ?? createRendererResponse(request)
    rendererResponses.set(request, response)
    return (await response).clone()
  },
}
