'use strict';

const { throwError } = require('../../../errors');

// Validate JSON-RPC payload is correct format
const validatePayload = function ({ payload }) {
  const payloadA = typeof payload === 'object' ? payload : {};
  const { jsonrpc, method, id, params } = payloadA;

  validators.forEach(validator =>
    applyValidator({ validator, payload, jsonrpc, method, id, params }));
};

const applyValidator = function ({
  validator: { check, message, reason = 'SYNTAX_VALIDATION' },
  payload,
  jsonrpc,
  method,
  id,
  params,
}) {
  const isValid = check({ payload, jsonrpc, method, id, params });
  if (isValid) { return; }

  const messageA = `Invalid JSON-RPC payload: ${message}`;
  throwError(messageA, { reason });
};

const validators = [
  {
    check: ({ payload }) => payload && typeof payload === 'object',
    message: 'it must be an object',
    reason: 'REQUEST_FORMAT',
  },
  {
    check: ({ payload }) => !Array.isArray(payload),
    message: 'batch requests are not supported, so the payload must not be an array',
  },
  {
    check: ({ jsonrpc }) => jsonrpc === undefined ||
      typeof jsonrpc === 'string',
    message: '\'jsonrpc\' must be a string or undefined',
  },
  {
    check: ({ method }) => typeof method === 'string',
    message: '\'method\' must be a string',
  },
  {
    check: ({ id }) => id == null ||
      typeof id === 'string' ||
      Number.isInteger(id),
    message: '\'id\' must be a string, an integer, null or undefined',
  },
  {
    check: ({ params }) => params === undefined ||
      params.constructor === Object ||
      Array.isArray(params),
    message: '\'params\' type is invalid',
  },
  {
    check: ({ params }) => !Array.isArray(params) || (
      params.length <= 1 &&
      params.every(param => param && param.constructor === Object)
    ),
    message: '\'params\' must only contain one object or none',
  },
];

module.exports = {
  validatePayload,
};
