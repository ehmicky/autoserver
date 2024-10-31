import { load } from './load/main.js'
import { parse } from './parse/main.js'
import { transformError, transformSuccess } from './response.js'

export const graphql = {
  name: 'graphql',
  title: 'GraphQL',
  routes: ['/graphql'],
  methods: ['GET', 'POST'],
  parse,
  transformSuccess,
  transformError,
  load,
}
