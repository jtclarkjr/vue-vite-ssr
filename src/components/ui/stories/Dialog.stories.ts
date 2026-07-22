import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from '../Button.vue'
import Dialog from '../Dialog.vue'

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  args: { title: 'Invite collaborator', description: 'They will receive access immediately.' },
  render: (args) => ({
    components: { Button, Dialog },
    setup: () => ({ args }),
    template: `<Dialog v-bind="args">
      <template #trigger><Button>Open dialog</Button></template>
      <p>Dialog content is composed through slots.</p>
      <template #footer><Button variant="secondary">Cancel</Button></template>
    </Dialog>`,
  }),
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
