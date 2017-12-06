'use strict';

const { reduceAsync, identity } = require('../utilities');
const { rpcAdapters } = require('../rpc');

// Reducer function that takes the schema as input and output,
// and iterate over rpc-specific reduce functions
const rpcReducer = function ({ schema, processors, postProcess = identity }) {
  return reduceAsync(
    processors,
    (schemaA, func) => func(schemaA),
    schema,
    (schemaA, schemaB) => postProcess({ ...schemaA, ...schemaB }),
  );
};

// Apply rpc-specific compile-time logic
const rpcSchema = function ({ schema }) {
  const processors = getProcessors({ name: 'compileSchema' });
  return rpcReducer({ schema, processors });
};

// Apply rpc-specific startup logic
const rpcStartServer = function ({ schema }) {
  const processors = getProcessors({ name: 'startServer' });
  return rpcReducer({ schema, processors, postProcess: rpcStartServerProcess });
};

const getProcessors = function ({ name }) {
  return Object.values(rpcAdapters)
    .map(rpcAdapter => rpcAdapter[name])
    .filter(handler => handler);
};

const rpcStartServerProcess = schema => ({ schema });

module.exports = {
  rpcSchema,
  rpcStartServer,
};
