import { ABORTED } from './aborted.js'
import { AUTHORIZATION } from './authorization.js'
import { CHARSET } from './charset.js'
import { COMMAND } from './command.js'
import { COMPRESS } from './compress.js'
import { CONFIG_RUNTIME } from './config_runtime.js'
import { CONFIG_VALIDATION } from './config_validation.js'
import { CONFLICT } from './conflict.js'
import { DATABASE } from './database.js'
import { ENGINE } from './engine.js'
import { FORMAT } from './format.js'
import { LOG } from './log.js'
import { METHOD } from './method.js'
import { REQUEST_NEGOTIATION, RESPONSE_NEGOTIATION } from './negotiation.js'
import { NO_CONTENT_LENGTH } from './no_content_length.js'
import { NOT_FOUND } from './not_found.js'
import { PAYLOAD_LIMIT } from './payload_limit.js'
import { PLUGIN } from './plugin.js'
import { PROTOCOL } from './protocol.js'
import { ROUTE } from './route.js'
import { RPC } from './rpc.js'
import { SUCCESS } from './success.js'
import { TIMEOUT } from './timeout.js'
import { UNKNOWN } from './unknown.js'
import { URL_LIMIT } from './url_limit.js'
// eslint-disable-next-line import/max-dependencies
import { VALIDATION } from './validation.js'

// List of error reasons.
// Keys are the exception.reason of the exception thrown
// Values are merged to exceptions thrown
// All error reasons and their related status
export const REASONS = {
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
