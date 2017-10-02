'use strict';

// Retrieve GraphQL main definition
// Takes into account GraphQL's `operationName`
const getMainDef = function ({
  queryDocument: { definitions },
  operationName,
}) {
  return definitions
    .filter(({ kind }) => kind === 'OperationDefinition')
    .find(({ name }) =>
      !operationName || (name && name.value) === operationName
    );
};

module.exports = {
  getMainDef,
};
