import { defineHandler, defineHead } from 'void'

export const loader = defineHandler((c) => {
  c.set('notFoundPage', true)
  return {}
})

export const head = defineHead(() => ({ title: 'Page not found' }))
