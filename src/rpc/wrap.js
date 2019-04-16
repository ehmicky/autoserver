import { wrapAdapters } from '../adapters/wrap.js'

import { RPC_ADAPTERS } from './adapters/main.js'
import { checkMethod } from './method_check.js'
import { transformResponse } from './transform.js'

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
