import type { Preview } from '@storybook/vue3-vite'
import '../src/assets/styles/main.scss'

const preview: Preview = {
  parameters: { a11y: { test: 'error' }, controls: { expanded: true }, layout: 'centered' },
  tags: ['autodocs'],
}

export default preview
