'use strict';

const { reduceAsync, identity } = require('../utilities');
const { rpcHandlers } = require('../rpc');

// Returns a reducer function that takes the schema as input and output,
// and iterate over rpc-specific reduce functions
const getRpcReducer = function (name, postProcess) {
  const processors = getProcessors({ name });
  return rpcReducer.bind(null, { processors, postProcess });
};

const getProcessors = function ({ name }) {
  return Object.values(rpcHandlers)
    .map(rpcHandler => rpcHandler[name])
    .filter(handler => handler);
};

const rpcReducer = function (
  { processors, postProcess = identity },
  { schema },
) {
  return reduceAsync(
    processors,
    (schemaA, func) => func(schemaA),
    schema,
    (schemaA, schemaB) => postProcess({ ...schemaA, ...schemaB }),
  );
};

// Apply rpc-specific compile-time logic
const rpcSchema = getRpcReducer('compileSchema');

// Apply rpc-specific startup logic
const rpcStartServer = getRpcReducer('startServer', schema => ({ schema }));

module.exports = {
  rpcSchema,
  rpcStartServer,
};
