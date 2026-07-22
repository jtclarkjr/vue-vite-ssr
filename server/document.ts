import { uneval } from 'devalue'

export function renderDocument(template: string, html: string, state: unknown): string {
  return template
    .replace('<!--app-html-->', html)
    .replace('<!--pinia-state-->', `<script>window.__PINIA_STATE__=${uneval(state)}</script>`)
}
