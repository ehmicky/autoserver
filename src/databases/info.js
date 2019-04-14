'use strict'

const { getMember } = require('../adapters/get.js')

const { DATABASE_ADAPTERS } = require('./adapters/main.js')

const DATABASE_OPTS = getMember(DATABASE_ADAPTERS, 'opts', {})
const DATABASE_DEFAULTS = getMember(DATABASE_ADAPTERS, 'defaults', {})

module.exports = {
  DATABASE_OPTS,
  DATABASE_DEFAULTS,
}
