'use strict';

// Use operation-specific logic to parse the request into an
// operation-agnostic `operationDef`
const parseOperation = function ({ mInput, operationHandler: { handler } }) {
  return handler(mInput);
};

module.exports = {
  parseOperation,
};
