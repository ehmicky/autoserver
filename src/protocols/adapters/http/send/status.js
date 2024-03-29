// All HTTP status codes, according to error reason
const STATUS_CODE_MAP = {
  SUCCESS: 200,

  VALIDATION: 400,
  ABORTED: 400,

  AUTHORIZATION: 403,

  ROUTE: 404,
  NOT_FOUND: 404,

  METHOD: 405,
  COMMAND: 405,

  RESPONSE_NEGOTIATION: 406,

  TIMEOUT: 408,

  CONFLICT: 409,

  NO_CONTENT_LENGTH: 411,

  PAYLOAD_LIMIT: 413,

  URL_LIMIT: 414,

  REQUEST_NEGOTIATION: 415,

  CONFIG_VALIDATION: 0,
  CONFIG_RUNTIME: 500,

  FORMAT: 500,
  CHARSET: 500,
  PROTOCOL: 500,
  RPC: 500,
  DATABASE: 500,
  LOG: 500,
  COMPRESS: 500,
  PLUGIN: 500,

  ENGINE: 500,
  UNKNOWN: 500,
}

// Generic error status when none can be found
const FAILURE_STATUS_CODE = 500

// Set response's HTTP status code
export const setStatusCode = ({ res, reason }) => {
  const statuscode = STATUS_CODE_MAP[reason] || FAILURE_STATUS_CODE
  res.statusCode = statuscode
}
