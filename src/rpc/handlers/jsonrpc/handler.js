'use strict';

const { validatePayload } = require('./validate');

// Use JSON-RPC-specific logic to parse the request into an
// rpc-agnostic `rpcDef`
const handler = function ({ payload }) {
  validatePayload({ payload });

  const { method, params } = payload;
  const args = getArgs({ params });
  const rpcDef = { commandName: method, args };
  return { rpcDef };
};

// Can either be [{ ... }], [], {...} or nothing
const getArgs = function ({ params = {} }) {
  if (!Array.isArray(params)) { return params; }

  if (params.length === 0) { return {}; }

  return params[0];
};

module.exports = {
  handler,
};
