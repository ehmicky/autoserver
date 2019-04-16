import { getNames, getMember } from '../adapters/get.js'

import { PROTOCOL_ADAPTERS } from './adapters/main.js'

export const PROTOCOLS = getNames(PROTOCOL_ADAPTERS)
export const PROTOCOL_OPTS = getMember(PROTOCOL_ADAPTERS, 'opts', {})
export const PROTOCOL_DEFAULTS = getMember(PROTOCOL_ADAPTERS, 'defaults', {})
