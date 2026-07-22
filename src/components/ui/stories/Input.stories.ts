import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Input from '../Input.vue'

const meta = {
  title: 'UI/Input',
  component: Input,
  args: { label: 'Email', placeholder: 'you@example.com', help: 'We never share your address.' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Invalid: Story = { args: { error: 'Enter a valid email address.' } }
