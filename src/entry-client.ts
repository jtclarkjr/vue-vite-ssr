import { createApplication } from './app'

const { app, router } = createApplication({
  ssr: true,
  initialState: window['__PINIA_STATE__'],
})

void router.isReady().then(() => app.mount('#app'))
