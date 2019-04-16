const { SUCCESS } = require('./success.js')
const { VALIDATION } = require('./validation.js')
const { ABORTED } = require('./aborted.js')
const { AUTHORIZATION } = require('./authorization.js')
const { ROUTE } = require('./route.js')
const { NOT_FOUND } = require('./not_found.js')
const { METHOD } = require('./method.js')
const { COMMAND } = require('./command.js')
const {
  REQUEST_NEGOTIATION,
  RESPONSE_NEGOTIATION,
} = require('./negotiation.js')
const { TIMEOUT } = require('./timeout.js')
const { CONFLICT } = require('./conflict.js')
const { NO_CONTENT_LENGTH } = require('./no_content_length.js')
const { PAYLOAD_LIMIT } = require('./payload_limit.js')
const { URL_LIMIT } = require('./url_limit.js')
const { CONFIG_VALIDATION } = require('./config_validation.js')
const { CONFIG_RUNTIME } = require('./config_runtime.js')
const { FORMAT } = require('./format.js')
const { CHARSET } = require('./charset.js')
const { PROTOCOL } = require('./protocol.js')
const { RPC } = require('./rpc.js')
const { DATABASE } = require('./database.js')
const { LOG } = require('./log.js')
const { COMPRESS } = require('./compress.js')
const { PLUGIN } = require('./plugin.js')
const { ENGINE } = require('./engine.js')
// eslint-disable-next-line import/max-dependencies
const { UNKNOWN } = require('./unknown.js')

// List of error reasons.
// Keys are the exception.reason of the exception thrown
// Values are merged to exceptions thrown
// All error reasons and their related status
const REASONS = {
  SUCCESS,
  VALIDATION,
  ABORTED,
  AUTHORIZATION,
  ROUTE,
  NOT_FOUND,
  METHOD,
  COMMAND,
  REQUEST_NEGOTIATION,
  RESPONSE_NEGOTIATION,
  TIMEOUT,
  CONFLICT,
  NO_CONTENT_LENGTH,
  PAYLOAD_LIMIT,
  URL_LIMIT,
  CONFIG_VALIDATION,
  CONFIG_RUNTIME,
  FORMAT,
  CHARSET,
  PROTOCOL,
  RPC,
  DATABASE,
  LOG,
  COMPRESS,
  PLUGIN,
  ENGINE,
  UNKNOWN,
}

module.exports = {
  REASONS,
}
