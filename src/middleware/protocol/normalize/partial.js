'use strict';

const { omit } = require('../../../utilities');

// Normalize protocol handlers
// Some protocols are stateful (e.g. WebSocket) and reuse the same URL for the
// whole session. Some protocols also do not have the concept of methods or
// headers like HTTP do. In those cases, `path`, `method` and `headers` are
// taken from the payload, the headers or the query variables.
// All protocol handlers must at least parse `origin`, `queryvars` and `payload`
const normalizePartialProtocol = function ({
  protocolHandler: { getHeaders, getMethod, getPath },
  queryvars,
  headers,
  method,
  path,
  payload,
}) {
  const isPartial = isPartialProtocol({ getHeaders, getMethod, getPath });

  if (!isPartial) {
    return { payload, headers, method, path, queryvars };
  }

  const { body, payload: payloadA } = normalizePayload({ payload });
  const headersA = normalize({
    name: 'headers',
    value: headers,
    alternatives: [payloadA],
    method: getHeaders,
  });
  const alternatives = [payloadA, headersA, queryvars];
  const methodA = normalize({
    name: 'method',
    value: method,
    alternatives,
    method: getMethod,
  });
  const pathA = normalize({
    name: 'path',
    value: path,
    alternatives,
    method: getPath,
  });

  const queryvarsA = omit(queryvars, ['method', 'path']);

  return {
    payload: body,
    headers: headersA,
    method: methodA,
    path: pathA,
    queryvars: queryvarsA,
  };
};

const isPartialProtocol = function ({ getHeaders, getMethod, getPath }) {
  return getHeaders === undefined ||
    getMethod === undefined ||
    getPath === undefined;
};

// Only use payload if it is an object
const normalizePayload = function ({ payload }) {
  if (!payload || payload.constructor !== Object) {
    return { body: payload };
  }

  // If it is used as an alternative, real payload should be under
  // `payload.body`
  const { body } = payload;
  return { body, payload };
};

const normalize = function ({ name, value, alternatives, method }) {
  if (method !== undefined) { return value; }

  const alternative = alternatives.find(({ [name]: valueA } = {}) => valueA);
  if (alternative === undefined) { return; }

  return alternative[name];
};

module.exports = {
  normalizePartialProtocol,
};
