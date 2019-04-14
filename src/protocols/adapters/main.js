'use strict'

const { http } = require('./http/main.js')

const PROTOCOL_ADAPTERS = [http]

module.exports = {
  PROTOCOL_ADAPTERS,
}
