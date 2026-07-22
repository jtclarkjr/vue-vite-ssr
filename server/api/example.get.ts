import { defineHandler } from 'nitro'

import type { ExampleResponse } from '../../src/api/types'

export const getExample = (): ExampleResponse => ({
  message: 'This response came from a Nitro API route.',
  renderedAt: new Date().toISOString(),
})

export default defineHandler(getExample)
