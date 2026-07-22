import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig, lazyPlugins } from 'vite-plus'

const rekaComponentNames = [
  'DialogClose',
  'DialogContent',
  'DialogDescription',
  'DialogOverlay',
  'DialogPortal',
  'DialogRoot',
  'DialogTitle',
  'DialogTrigger',
  'Primitive',
] as const
const rekaComponents = new Set<string>(rekaComponentNames)

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
      'auto-imports.d.ts',
      'components.d.ts',
      'typed-router.d.ts',
      'storybook-static',
      'graphify-out',
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
      '**/storybook-static/**',
      '**/graphify-out/**',
      '**/auto-imports.d.ts',
      '**/components.d.ts',
      '**/typed-router.d.ts',
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
        files: ['.storybook/**/*.ts'],
        rules: {
          'vite-plus/prefer-vite-plus-imports': 'off',
        },
      },
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
  plugins: lazyPlugins(() => [
    VueRouter({
      routesFolder: 'src/pages',
      dts: 'src/typed-router.d.ts',
      importMode: 'async',
    }),
    vue(),
    Components({
      dirs: ['src/components'],
      dts: 'src/components.d.ts',
      resolvers: [(name) => (rekaComponents.has(name) ? { name, from: 'reka-ui' } : undefined)],
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          vue: ['createSSRApp'],
          'vue-router': ['createMemoryHistory', 'createRouter', 'createWebHistory', 'RouterLink'],
          'reka-ui': [...rekaComponentNames],
        },
        {
          from: 'reka-ui',
          imports: ['PrimitiveProps'],
          type: true,
        },
      ],
      dirs: ['src/composables', 'src/stores'],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
    }),
  ]),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssr: {
    noExternal: ['reka-ui'],
  },
})
