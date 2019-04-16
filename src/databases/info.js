import { getMember } from '../adapters/get.js'

import { DATABASE_ADAPTERS } from './adapters/main.js'

export const DATABASE_OPTS = getMember(DATABASE_ADAPTERS, 'opts', {})
export const DATABASE_DEFAULTS = getMember(DATABASE_ADAPTERS, 'defaults', {})
