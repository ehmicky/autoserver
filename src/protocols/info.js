import { getNames, getMember } from '../adapters/get.js'

import { PROTOCOL_ADAPTERS } from './adapters/main.js'

const PROTOCOLS = getNames(PROTOCOL_ADAPTERS)
const PROTOCOL_OPTS = getMember(PROTOCOL_ADAPTERS, 'opts', {})
const PROTOCOL_DEFAULTS = getMember(PROTOCOL_ADAPTERS, 'defaults', {})

module.exports = {
  PROTOCOLS,
  PROTOCOL_OPTS,
  PROTOCOL_DEFAULTS,
}
