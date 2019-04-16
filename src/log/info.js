const { getMember } = require('../adapters/get.js')

const { LOG_ADAPTERS } = require('./adapters/main.js')

const LOG_OPTS = getMember(LOG_ADAPTERS, 'opts', {})

module.exports = {
  LOG_OPTS,
}
