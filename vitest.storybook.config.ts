import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from 'vite-plus/test/browser-playwright'
import { defineConfig, mergeConfig } from 'vite-plus'

import viteConfig from './vite.config'

const directory = dirname(fileURLToPath(import.meta.url))

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [storybookTest({ configDir: join(directory, '.storybook') })],
    optimizeDeps: {
      include: ['@storybook/addon-a11y/preview', '@storybook/vue3-vite', 'vitest'],
    },
    test: {
      name: 'storybook',
      setupFiles: ['.storybook/vitest.setup.ts'],
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
      },
    },
  }),
)
