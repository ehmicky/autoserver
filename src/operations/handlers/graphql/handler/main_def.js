'use strict';

const { throwError } = require('../../../../error');

const { validateDuplicates } = require('./duplicates');

// Retrieve GraphQL main definition
// Takes into account GraphQL's `operationName`
const getMainDef = function ({
  queryDocument: { definitions },
  operationName,
}) {
  const defs = definitions.filter(({ kind }) => kind === 'OperationDefinition');

  // GraphQL spec 5.1.1.1 'Operation Name Uniqueness'
  validateDuplicates({ nodes: defs, type: 'operations' });

  validateAnonymousNames(defs);

  return defs.find(({ name }) =>
    !operationName || (name && name.value) === operationName);
};

// GraphQL spec 5.1.2.1 'Lone Anonymous Operation'
const validateAnonymousNames = function (defs) {
  const hasAnonymousOperation = defs.some(({ name }) => name === null);

  if (hasAnonymousOperation && defs.length > 1) {
    const message = `All operations must have names, if there are several of them`;
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }
};

module.exports = {
  getMainDef,
};
