import { vi } from 'vite-plus/test'

Object.defineProperty(window, 'scrollTo', {
  configurable: true,
  value: vi.fn<typeof window.scrollTo>(),
  writable: true,
})
