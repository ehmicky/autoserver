'use strict';

const { omit } = require('../../../utilities');

// All error reasons and their related JSON-RPC error codes
// We use the code `1` for any error related to database/request runtime issues
const { ERROR_CODES_MAP, DEFAULT_ERROR_CODE } = require('./error_codes');

// Apply JSON-RPC-specific error response transformation
const transformSuccess = function ({ response: { content }, payload }) {
  const { jsonrpc, id, other } = getResponse({ payload });

  return { jsonrpc, id, result: content, error: other };
};

// Apply JSON-RPC-specific error response transformation
const transformError = function ({
  response: { content: { error, error: { description, type } } },
  payload,
}) {
  const { jsonrpc, id, other } = getResponse({ payload });

  const data = omit(error, ['description']);
  const code = ERROR_CODES_MAP[type] || DEFAULT_ERROR_CODE;
  const errorA = { code, message: description, data };

  return { jsonrpc, id, result: other, error: errorA };
};

// Response common to both success and error
const getResponse = function ({ payload }) {
  const payloadA = getPayload({ payload });

  const jsonrpc = getJsonrpc({ payload: payloadA });
  const id = getId({ payload: payloadA });
  // JSON-RPC 2.0 uses `undefined`, 1.0 uses `null`
  const other = jsonrpc === '2.0' ? undefined : null;

  return { jsonrpc, id, other };
};

// Fix broken payloads
const getPayload = function ({ payload }) {
  if (payload && typeof payload === 'object') { return payload; }

  return {};
};

// We use the same JSON-RPC version as the request (1.0 has `undefined` field),
// and defaults to 2.0 if unknown
const getJsonrpc = function ({ payload: { jsonrpc } }) {
  return jsonrpc === undefined ? undefined : '2.0';
};

// Reuse request id in response
const getId = function ({ payload: { jsonrpc, id } }) {
  if (id != null) { return id; }

  // JSON-RPC 2.0 uses `undefined`, 1.0 uses `null`
  return jsonrpc === '2.0' ? undefined : null;
};

module.exports = {
  transformSuccess,
  transformError,
};
