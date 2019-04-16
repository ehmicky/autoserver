import { transformSuccess, transformError } from './response.js'
import { parse } from './parse.js'

const jsonrpc = {
  name: 'jsonrpc',
  title: 'JSON-RPC',
  routes: ['/jsonrpc'],
  methods: ['POST'],
  parse,
  transformSuccess,
  transformError,
}

module.exports = {
  jsonrpc,
}
