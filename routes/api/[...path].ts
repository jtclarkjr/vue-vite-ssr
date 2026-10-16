import { defineHandler } from 'void'

export default defineHandler((c) => c.json({ error: { message: 'Not Found' } }, 404))
