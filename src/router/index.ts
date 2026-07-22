import { routes } from 'vue-router/auto-routes'

export function createAppRouter(ssr = false) {
  return createRouter({
    history: ssr
      ? createMemoryHistory(import.meta.env.BASE_URL)
      : createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: () => ({ top: 0 }),
  })
}
