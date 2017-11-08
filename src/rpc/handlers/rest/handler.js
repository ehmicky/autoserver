'use strict';

const { getArgs } = require('./args');
const { getCommandName } = require('./command');

// Use JSON-RPC-specific logic to parse the request into an
// rpc-agnostic `rpcDef`
const handler = function ({
  payload,
  method,
  queryvars,
  pathvars: { modelname, id },
}) {
  const args = getArgs({ method, payload, queryvars, id });
  const commandName = getCommandName({ method, modelname, args });
  return { rpcDef: { commandName, args } };
};

module.exports = {
  handler,
};
