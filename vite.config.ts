import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { voidVue } from '@void/vue/plugin'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig, lazyPlugins } from 'vite-plus'
import { voidPlugin } from 'void'

const componentLibraryNames = ['Button', 'Card', 'Dialog', 'Input', 'Spinner'] as const
const componentLibraryComponents = new Set<string>(componentLibraryNames)
const isTest = Boolean(process.env.VITEST)

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    semi: false,
    singleQuote: true,
    printWidth: 100,
    trailingComma: 'all',
    ignorePatterns: [
      'AGENTS.md',
      'auto-imports.d.ts',
      'components.d.ts',
      'graphify-out',
      '**/.void/**',
      '**/.wrangler/**',
      '.void-wrangler.jsonc',
      'db/migrations/meta/**',
    ],
  },
  lint: {
    plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'vue', 'vitest'],
    categories: {
      correctness: 'error',
      suspicious: 'warn',
    },
    env: {
      browser: true,
      builtin: true,
    },
    ignorePatterns: [
      '**/dist/**',
      '**/coverage/**',
      '**/graphify-out/**',
      '**/auto-imports.d.ts',
      '**/components.d.ts',
      '**/.void/**',
      '**/.wrangler/**',
      '.void-wrangler.jsonc',
      'db/migrations/meta/**',
    ],
    rules: {
      'no-array-constructor': 'error',
      'typescript/ban-ts-comment': 'error',
      'typescript/no-empty-object-type': 'error',
      'typescript/no-explicit-any': 'error',
      'typescript/no-namespace': 'error',
      'typescript/no-require-imports': 'error',
      'typescript/no-unnecessary-type-constraint': 'error',
      'typescript/no-unsafe-function-type': 'error',
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    overrides: [
      {
        files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts', '**/*.vue'],
        rules: {
          'constructor-super': 'off',
          'getter-return': 'off',
          'no-class-assign': 'off',
          'no-const-assign': 'off',
          'no-dupe-class-members': 'off',
          'no-dupe-keys': 'off',
          'no-func-assign': 'off',
          'no-import-assign': 'off',
          'no-new-native-nonconstructor': 'off',
          'no-obj-calls': 'off',
          'no-redeclare': 'off',
          'no-setter-return': 'off',
          'no-this-before-super': 'off',
          'no-undef': 'off',
          'no-unreachable': 'off',
          'no-unsafe-negation': 'off',
          'no-var': 'error',
          'no-with': 'off',
          'prefer-const': 'error',
          'prefer-rest-params': 'error',
          'prefer-spread': 'error',
        },
      },
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin',
      },
    ],
  },
  plugins: [
    isTest ? [] : voidPlugin(),
    lazyPlugins(() => [
      isTest ? [] : VueDevTools(),
      isTest ? vue() : voidVue(),
      Components({
        dirs: ['src/components'],
        dts: 'src/components.d.ts',
        resolvers: [
          (name) =>
            componentLibraryComponents.has(name)
              ? { name, from: '@jtclarkjr/component-library-vue' }
              : undefined,
        ],
      }),
      AutoImport({
        imports: ['vue'],
        dirs: ['src/composables'],
        dts: 'src/auto-imports.d.ts',
        vueTemplate: true,
      }),
    ]),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    dedupe: ['vue'],
  },
  ssr: {
    noExternal: ['@jtclarkjr/component-library-vue', 'reka-ui'],
  },
})
