'use strict';

// Fire operation-specific logic
const operationExecute = function ({ mInput, operationHandler: { handler } }) {
  return handler(mInput);
};

module.exports = {
  operationExecute,
};
