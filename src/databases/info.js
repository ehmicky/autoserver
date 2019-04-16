import { getMember } from '../adapters/get.js'

import { DATABASE_ADAPTERS } from './adapters/main.js'

const DATABASE_OPTS = getMember(DATABASE_ADAPTERS, 'opts', {})
const DATABASE_DEFAULTS = getMember(DATABASE_ADAPTERS, 'defaults', {})

module.exports = {
  DATABASE_OPTS,
  DATABASE_DEFAULTS,
}
