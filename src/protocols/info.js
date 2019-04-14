'use strict'

const { getNames, getMember } = require('../adapters/get.js')

const { PROTOCOL_ADAPTERS } = require('./adapters/main.js')

const PROTOCOLS = getNames(PROTOCOL_ADAPTERS)
const PROTOCOL_OPTS = getMember(PROTOCOL_ADAPTERS, 'opts', {})
const PROTOCOL_DEFAULTS = getMember(PROTOCOL_ADAPTERS, 'defaults', {})

module.exports = {
  PROTOCOLS,
  PROTOCOL_OPTS,
  PROTOCOL_DEFAULTS,
}
