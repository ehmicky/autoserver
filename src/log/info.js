import { getMember } from '../adapters/get.js'

import { LOG_ADAPTERS } from './adapters/main.js'

const LOG_OPTS = getMember(LOG_ADAPTERS, 'opts', {})

module.exports = {
  LOG_OPTS,
}
