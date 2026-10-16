import { defineHandler, type InferProps } from 'void'
import { fetch } from 'void/client'

export const loader = defineHandler(async () => {
  const [example, health] = await Promise.all([fetch('/api/example'), fetch('/api/health')])
  return { example, health }
})

export type Props = InferProps<typeof loader>
