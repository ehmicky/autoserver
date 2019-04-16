import { getNames } from '../adapters/get.js'

import { RPC_ADAPTERS } from './adapters/main.js'

const RPCS = getNames(RPC_ADAPTERS)

module.exports = {
  RPCS,
}
