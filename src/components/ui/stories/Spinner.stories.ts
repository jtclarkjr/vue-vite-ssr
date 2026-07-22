import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Spinner from '../Spinner.vue'

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  args: { label: 'Loading content', size: 'md' },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
