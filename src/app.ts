import type { StateTree } from 'pinia'

import App from './App.vue'
import { apiClientKey, createApiClient, type ApiClient } from './api/client'
import { createAppRouter } from './router'

export interface CreateApplicationOptions {
  ssr?: boolean
  initialState?: StateTree
  apiBaseUrl?: string
  fetch?: typeof fetch
}

export interface ApplicationContext {
  app: ReturnType<typeof createApp>
  router: ReturnType<typeof createAppRouter>
  pinia: ReturnType<typeof createPinia>
  api: ApiClient
}

export function createApplication(options: CreateApplicationOptions = {}): ApplicationContext {
  const app = options.ssr ? createSSRApp(App) : createApp(App)
  const router = createAppRouter(options.ssr === true)
  const pinia = createPinia()
  const api = createApiClient({ baseUrl: options.apiBaseUrl, fetch: options.fetch })

  if (options.initialState) pinia.state.value = options.initialState

  app.use(router)
  app.use(pinia)
  app.provide(apiClientKey, api)

  return { app, router, pinia, api }
}
