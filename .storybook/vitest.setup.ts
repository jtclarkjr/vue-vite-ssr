import * as a11yAnnotations from '@storybook/addon-a11y/preview'
import { setProjectAnnotations } from '@storybook/vue3-vite'
import { beforeAll } from 'vitest'

import projectAnnotations from './preview'

const annotations = setProjectAnnotations([a11yAnnotations, projectAnnotations])
beforeAll(annotations.beforeAll)
