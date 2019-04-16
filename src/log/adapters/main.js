import { logConsole } from './console/main.js'
import { logDebug } from './debug/main.js'
import { logHttp } from './http/main.js'
import { logCustom } from './custom/main.js'

const LOG_ADAPTERS = [logConsole, logDebug, logHttp, logCustom]

module.exports = {
  LOG_ADAPTERS,
}
