import type { StateTree } from 'pinia'

declare global {
  interface Window {
    __PINIA_STATE__?: StateTree
  }
}
