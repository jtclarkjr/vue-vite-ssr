import { createApplication } from './app'

const { app, router } = createApplication()

void router.isReady().then(() => app.mount('#app'))
