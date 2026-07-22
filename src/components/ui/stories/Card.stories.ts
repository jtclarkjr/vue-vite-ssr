import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Card from '../Card.vue'

const meta = {
  title: 'UI/Card',
  component: Card,
  args: {
    title: 'Composable card',
    default: 'Body content is provided through the default slot.',
    variant: 'default',
  },
  render: (args) => ({
    components: { Card },
    setup: () => ({ args }),
    template:
      '<Card v-bind="args">{{ args.default }}<template #footer>Optional footer</template></Card>',
  }),
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Accent: Story = { args: { variant: 'accent' } }
