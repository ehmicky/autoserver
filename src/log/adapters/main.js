'use strict'

const { logConsole } = require('./console/main.js')
const { logDebug } = require('./debug/main.js')
const { logHttp } = require('./http/main.js')
const { logCustom } = require('./custom/main.js')

const LOG_ADAPTERS = [logConsole, logDebug, logHttp, logCustom]

module.exports = {
  LOG_ADAPTERS,
}
