import { defineHandler, HTTPError } from 'nitro'

export default defineHandler(() => {
  throw HTTPError.status(404)
})
