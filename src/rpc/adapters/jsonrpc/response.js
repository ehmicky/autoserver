import { omit } from '../../../utils/functional/filter.js'

// Apply JSON-RPC-specific error response transformation
export const transformSuccess = function({ response: { content }, payload }) {
  const { jsonrpc, id, other } = getResponse({ payload })

  return { jsonrpc, id, result: content, error: other }
}

// Apply JSON-RPC-specific error response transformation
export const transformError = function({
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

  const data = omit(error, ['description'])
  const code = ERROR_CODES_MAP[type] || DEFAULT_ERROR_CODE
  const errorA = { code, message: description, data, metadata }

  return { jsonrpc, id, result: other, error: errorA }
}

// Response common to both success and error
const getResponse = function({ payload }) {
  const payloadA = getPayload({ payload })

  const jsonrpc = getJsonrpc({ payload: payloadA })
  const id = getId({ payload: payloadA })
  // JSON-RPC 2.0 uses `undefined`, 1.0 uses `null`
  const other = jsonrpc === '2.0' ? undefined : null

  return { jsonrpc, id, other }
}

// Fix broken payloads
const getPayload = function({ payload }) {
  if (payload && typeof payload === 'object') {
    return payload
  }

  return {}
}

// We use the same JSON-RPC version as the request (1.0 has `undefined` field),
// and defaults to 2.0 if unknown
const getJsonrpc = function({ payload: { jsonrpc } }) {
  return jsonrpc === undefined ? undefined : '2.0'
}

// Reuse request id in response
const getId = function({ payload: { jsonrpc, id } }) {
  if (id != null) {
    return id
  }

  // JSON-RPC 2.0 uses `undefined`, 1.0 uses `null`
  return jsonrpc === '2.0' ? undefined : null
}

// All error reasons and their related JSON-RPC error codes
const ERROR_CODES_MAP = {
  SUCCESS: 0,
  VALIDATION: -32602,
  ABORTED: -32600,
  AUTHORIZATION: 1,
  ROUTE: -32601,
  NOT_FOUND: 1,
  METHOD: -32601,
  COMMAND: -32601,
  RESPONSE_NEGOTIATION: -32600,
  TIMEOUT: 1,
  CONFLICT: 1,
  NO_CONTENT_LENGTH: -32600,
  PAYLOAD_LIMIT: -32600,
  URL_LIMIT: -32600,
  REQUEST_NEGOTIATION: -32700,
  CONFIG_VALIDATION: -32603,
  CONFIG_RUNTIME: -32603,
  FORMAT: -32603,
  CHARSET: -32603,
  PROTOCOL: -32603,
  RPC: -32603,
  DATABASE: -32603,
  LOG: -32603,
  COMPRESS: -32603,
  PLUGIN: -32603,
  ENGINE: -32603,
  UNKNOWN: -32603,
}

// We use the code `1` for any error related to database/request runtime issues
const DEFAULT_ERROR_CODE = 1
