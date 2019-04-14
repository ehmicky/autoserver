'use strict'

const { wrapAdapters } = require('../adapters/wrap.js')

const { RPC_ADAPTERS } = require('./adapters/main.js')
const { checkMethod } = require('./method_check')
const { transformResponse } = require('./transform')

const members = ['name', 'title', 'load', 'parse']

const methods = {
  checkMethod,
  transformResponse,
}

const rpcAdapters = wrapAdapters({
  adapters: RPC_ADAPTERS,
  members,
  methods,
  reason: 'RPC',
})

module.exports = {
  rpcAdapters,
}
