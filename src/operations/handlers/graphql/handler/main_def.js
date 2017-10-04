'use strict';

const { throwError } = require('../../../../error');

// Retrieve GraphQL main definition
// Takes into account GraphQL's `operationName`
const getMainDef = function ({
  queryDocument: { definitions },
  operationName,
}) {
  const defs = definitions.filter(({ kind }) => kind === 'OperationDefinition');

  const operationNames = defs.map(({ name }) => name && name.value);
  validateOperatioNames({ operationNames });

  return defs.find(({ name }) =>
    !operationName || (name && name.value) === operationName
  );
};

const validateOperatioNames = function ({ operationNames }) {
  operationNames.forEach(validateOperatioName);
};

const validateOperatioName = function (operationName, index, operationNames) {
  const hasDuplicate = operationNames.slice(index + 1).includes(operationName);

  // GraphQL spec 5.1.1.1 'Operation Name Uniqueness'
  if (hasDuplicate) {
    const message = `Two operations are named '${operationName}'`;
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }

  // GraphQL spec 5.1.2.1 'Lone Anonymous Operation'
  if (operationName === null && operationNames.length > 1) {
    const message = `All operations must have names, if there are several of them`;
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }
};

module.exports = {
  getMainDef,
};
