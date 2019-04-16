import { parse } from './parse/main.js'

export const graphiql = {
  name: 'graphiql',
  title: 'GraphiQL',
  methods: ['GET'],
  routes: ['/graphiql'],
  parse,
}
