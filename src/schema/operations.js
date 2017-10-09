'use strict';

const { reduceAsync, identity } = require('../utilities');
const { operationHandlers } = require('../operations');

// Returns a reducer function that takes the schema as input and output,
// and iterate over operation-specific reduce functions
const getOperationReducer = function (name, postProcess) {
  const processors = getProcessors({ name });
  return operationsReducer.bind(null, { processors, postProcess });
};

const getProcessors = function ({ name }) {
  return Object.values(operationHandlers)
    .map(operationHandler => operationHandler[name])
    .filter(handler => handler);
};

const operationsReducer = function (
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

// Apply operation-specific compile-time logic
const operationsSchema = getOperationReducer('compileSchema');

// Apply operation-specific startup logic
const operationsStartServer = getOperationReducer(
  'startServer',
  schema => ({ schema }),
);

module.exports = {
  operationsSchema,
  operationsStartServer,
};
