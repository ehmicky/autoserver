'use strict'

const { transformSuccess, transformError } = require('./response')
const { parse } = require('./parse')

const rpc = {
  name: 'jsonrpc',
  title: 'JSON-RPC',
  routes: ['/jsonrpc'],
  methods: ['POST'],
  parse,
  transformSuccess,
  transformError,
}

module.exports = rpc
