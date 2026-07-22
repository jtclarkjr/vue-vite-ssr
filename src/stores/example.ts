import type { ExampleResponse } from '@/api/types'

export const useExampleStore = defineStore('example', () => {
  const data = ref<ExampleResponse>()
  const error = ref<string>()
  const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')

  const start = () => {
    status.value = 'loading'
    error.value = undefined
  }

  const succeed = (value: ExampleResponse) => {
    data.value = value
    status.value = 'ready'
  }

  const fail = (value: unknown) => {
    error.value = value instanceof Error ? value.message : 'Unknown API error'
    status.value = 'error'
  }

  return { data, error, status, start, succeed, fail }
})
