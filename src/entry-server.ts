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
