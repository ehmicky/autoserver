'use strict';

const { reduceAsync, identity } = require('../utilities');
const { operationHandlers } = require('../operations');

// Returns a reducer function that takes IDL as input and output,
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
  { idl },
) {
  return reduceAsync(
    processors,
    (idlA, func) => func(idlA),
    idl,
    (idlA, idlB) => postProcess({ ...idlA, ...idlB }),
  );
};

// Apply operation-specific compile-time logic
const operationsIdl = getOperationReducer('compileIdl');

// Apply operation-specific startup logic
const operationsStartServer = getOperationReducer(
  'startServer',
  idl => ({ idl }),
);

module.exports = {
  operationsIdl,
  operationsStartServer,
};
