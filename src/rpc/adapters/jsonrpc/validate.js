import { isObject } from '../../../utils/functional/type.js'
import { throwPb } from '../../../errors/props.js'

// Validate JSON-RPC payload is correct format
export const validatePayload = function ({ payload }) {
  const payloadA = typeof payload === 'object' ? payload : {}
  const { jsonrpc, method, id, params } = payloadA

  validators.forEach((validator) =>
    applyValidator({ validator, payload, jsonrpc, method, id, params }),
  )
}

const applyValidator = function ({
  validator: { check, message, reason = 'VALIDATION', extra },
  payload,
  jsonrpc,
  method,
  id,
  params,
}) {
  const isValid = check({ payload, jsonrpc, method, id, params })

  if (isValid) {
    return
  }

  const messageA = `Invalid JSON-RPC payload: ${message}`
  throwPb({ reason, message: messageA, extra })
}

const validators = [
  {
    check: ({ payload }) => payload && typeof payload === 'object',
    message: 'it must be an object',
    reason: 'REQUEST_NEGOTIATION',
    extra: { kind: 'type' },
  },
  {
    check: ({ payload }) => !Array.isArray(payload),
    message:
      'batch requests are not supported, so the payload must not be an array',
  },
  {
    check: ({ jsonrpc }) =>
      jsonrpc === undefined || typeof jsonrpc === 'string',
    message: "'jsonrpc' must be a string or undefined",
  },
  {
    check: ({ method }) => typeof method === 'string',
    message: "'method' must be a string",
  },
  {
    check: ({ id }) =>
      id == null || typeof id === 'string' || Number.isInteger(id),
    message: "'id' must be a string, an integer, null or undefined",
  },
  {
    check: ({ params }) =>
      params === undefined || isObject(params) || Array.isArray(params),
    message: "'params' type is invalid",
  },
  {
    check: ({ params }) =>
      !Array.isArray(params) || (params.length <= 1 && params.every(isObject)),
    message: "'params' must only contain one object or none",
  },
]
