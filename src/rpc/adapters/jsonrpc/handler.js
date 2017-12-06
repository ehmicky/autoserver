'use strict';

const { validatePayload } = require('./validate');

// Use JSON-RPC-specific logic to parse the request into an
// rpc-agnostic `rpcDef`
const handler = function ({ payload }) {
  validatePayload({ payload });

  const { method, params, id } = payload;

  const args = getArgs({ params });
  const argsA = addSilent({ args, id });

  const rpcDef = { commandName: method, args: argsA };
  return { rpcDef };
};

// Can either be [{ ... }], [], {...} or nothing
const getArgs = function ({ params = {} }) {
  if (!Array.isArray(params)) { return params; }

  if (params.length === 0) { return {}; }

  return params[0];
};

// If request `id` is absent, there should be no response according to
// JSON-RPC spec. We achieve this by settings `args.silent` `true`
const addSilent = function ({ args, id }) {
  if (id != null) { return args; }

  return { ...args, silent: true };
};

module.exports = {
  handler,
};
