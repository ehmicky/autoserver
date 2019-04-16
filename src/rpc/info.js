import { getNames } from '../adapters/get.js'

import { RPC_ADAPTERS } from './adapters/main.js'

export const RPCS = getNames(RPC_ADAPTERS)
