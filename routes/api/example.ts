import { defineHandler } from 'void'

export const getExample = () => ({
  message: 'This response came from a Void API route.',
  renderedAt: new Date().toISOString(),
})

export const GET = defineHandler(getExample)
