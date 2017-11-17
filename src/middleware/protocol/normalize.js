'use strict';

// Normalize protocol handlers
// Some protocols are stateful (e.g. WebSocket) and reuse the same URL for the
// whole session. Some protocols also do not have the concept of methods or
// headers like HTTP do. In those cases, `path`, `method` and `headers` are
// taken from the payload, the headers or the query variables.
// All protocol handlers must at least parse `origin`, `queryvars` and `payload`
const protocolNormalization = function ({
  protocolHandler: { getHeaders, getMethod, getPath },
  queryvars,
  headers,
  method,
  path,
  payload,
}) {
  const payloadA = getPayload({ payload });
  const headersA = normalize({
    name: 'headers',
    value: headers,
    alternatives: payloadA,
    method: getHeaders,
  });
  const headersB = headersA || {};

  const alternatives = [...payloadA, headersB, queryvars];
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

  return { headers: headersB, method: methodA, path: pathA };
};

// Only use payload if it is an object
const getPayload = function ({ payload }) {
  if (!payload || payload.constructor !== Object) { return []; }

  return [payload];
};

const normalize = function ({ name, value, alternatives, method }) {
  if (method !== undefined || value !== undefined) { return value; }

  const alternative = alternatives.find(({ [name]: valueA }) => valueA);
  if (alternative === undefined) { return; }

  return alternative[name];
};

module.exports = {
  protocolNormalization,
};
