import { getMember } from '../adapters/get.js'

import { LOG_ADAPTERS } from './adapters/main.js'

export const LOG_OPTS = getMember(LOG_ADAPTERS, 'opts', {})
