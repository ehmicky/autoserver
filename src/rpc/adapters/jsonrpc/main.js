import { transformSuccess, transformError } from './response.js'
import { parse } from './parse.js'

export const jsonrpc = {
  name: 'jsonrpc',
  title: 'JSON-RPC',
  routes: ['/jsonrpc'],
  methods: ['POST'],
  parse,
  transformSuccess,
  transformError,
}
