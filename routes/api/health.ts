import { defineHandler } from 'void'

export const getHealth = () => ({ status: 'ok', service: 'vue-vite-ssr' })

export const GET = defineHandler(getHealth)
