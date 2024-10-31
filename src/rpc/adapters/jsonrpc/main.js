import { parse } from './parse.js'
import { transformError, transformSuccess } from './response.js'

export const jsonrpc = {
  name: 'jsonrpc',
  title: 'JSON-RPC',
  routes: ['/jsonrpc'],
  methods: ['POST'],
  parse,
  transformSuccess,
  transformError,
}
