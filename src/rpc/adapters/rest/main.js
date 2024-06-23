import { parse } from './parse.js'

export const rest = {
  name: 'rest',
  title: 'REST',
  routes: ['/rest/:clientCollname{/:id}?'],
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  parse,
}
