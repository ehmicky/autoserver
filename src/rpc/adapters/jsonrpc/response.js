import omit from 'omit.js'

// Apply JSON-RPC-specific error response transformation
export const transformSuccess = function ({ response: { content }, payload }) {
  const { jsonrpc, id, other } = getResponse({ payload })

  return { jsonrpc, id, result: content, error: other }
}

// Apply JSON-RPC-specific error response transformation
export const transformError = function ({
  response: {
    content: {
      error,
      error: { description, type },
      metadata,
    },
  },
  payload,
}) {
  const { jsonrpc, id, other } = getResponse({ payload })

  const data = omit.default(error, ['description'])
  const code = ERROR_CODES_MAP[type] || DEFAULT_ERROR_CODE
  const errorA = { code, message: description, data, metadata }

  return { jsonrpc, id, result: other, error: errorA }
}

// Response common to both success and error
const getResponse = function ({ payload }) {
  const payloadA = getPayload({ payload })

  const jsonrpc = getJsonrpc({ payload: payloadA })
  const id = getId({ payload: payloadA })
  // JSON-RPC 2.0 uses `undefined`, 1.0 uses `null`
  // eslint-disable-next-line unicorn/no-null
  const other = jsonrpc === '2.0' ? undefined : null

  return { jsonrpc, id, other }
}

// Fix broken payloads
const getPayload = function ({ payload }) {
  if (payload && typeof payload === 'object') {
    return payload
  }

  return {}
}

// We use the same JSON-RPC version as the request (1.0 has `undefined` field),
// and defaults to 2.0 if unknown
const getJsonrpc = function ({ payload: { jsonrpc } }) {
  return jsonrpc === undefined ? undefined : '2.0'
}

// Reuse request id in response
const getId = function ({ payload: { jsonrpc, id } }) {
  if (id !== undefined && id !== null) {
    return id
  }

  // JSON-RPC 2.0 uses `undefined`, 1.0 uses `null`
  // eslint-disable-next-line unicorn/no-null
  return jsonrpc === '2.0' ? undefined : null
}

// All error reasons and their related JSON-RPC error codes
const ERROR_CODES_MAP = {
  SUCCESS: 0,
  VALIDATION: -32_602,
  ABORTED: -32_600,
  AUTHORIZATION: 1,
  ROUTE: -32_601,
  NOT_FOUND: 1,
  METHOD: -32_601,
  COMMAND: -32_601,
  RESPONSE_NEGOTIATION: -32_600,
  TIMEOUT: 1,
  CONFLICT: 1,
  NO_CONTENT_LENGTH: -32_600,
  PAYLOAD_LIMIT: -32_600,
  URL_LIMIT: -32_600,
  REQUEST_NEGOTIATION: -32_700,
  CONFIG_VALIDATION: -32_603,
  CONFIG_RUNTIME: -32_603,
  FORMAT: -32_603,
  CHARSET: -32_603,
  PROTOCOL: -32_603,
  RPC: -32_603,
  DATABASE: -32_603,
  LOG: -32_603,
  COMPRESS: -32_603,
  PLUGIN: -32_603,
  ENGINE: -32_603,
  UNKNOWN: -32_603,
}

// We use the code `1` for any error related to database/request runtime issues
const DEFAULT_ERROR_CODE = 1
