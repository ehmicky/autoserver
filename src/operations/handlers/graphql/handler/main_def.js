'use strict';

const { throwError } = require('../../../../error');

// Retrieve GraphQL main definition
const getMainDef = function ({
  queryDocument,
  queryDocument: { definitions },
  operationName,
  method,
}) {
  const mainDef = getDef({ definitions, operationName });

  validateMainDef({ mainDef, operationName });
  validateMainSelection({ mainDef, method });

  const fragments = getFragments({ queryDocument });

  return { mainDef, fragments };
};

// Retrieve the first `OperationDefinition`
// Takes into account GraphQL's `operationName`
const getDef = function ({ definitions, operationName }) {
  return definitions
    .filter(({ kind }) => kind === 'OperationDefinition')
    .find(({ name }) =>
      !operationName || (name && name.value) === operationName
    );
};

const validateMainDef = function ({ mainDef, operationName }) {
  if (!mainDef && operationName) {
    const message = `Could not find GraphQL operation '${operationName}'`;
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }

  if (!mainDef) {
    const message = 'Missing GraphQL query';
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }
};

const validateMainSelection = function ({
  mainDef: { selectionSet: { selections }, operation },
  method,
}) {
  if (selections.length > 1) {
    const names = getOperationNames({ selections });
    const message = `Cannot perform several GraphQL operations at once: ${names}`;
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }

  const [{ kind, name }] = selections;

  if (kind !== 'Field') {
    const message = 'Cannot use a GraphQL fragment as the main operation';
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }

  validateOperationType({ method, operation, name });
};

const validateOperationType = function ({ method, operation, name }) {
  if (method === 'find' && operation !== 'query') {
    const message = 'Can only perform GraphQL queries, not mutations, with the current protocol method';
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }

  const isFind = isFindQuery({ name });

  if (isFind && operation === 'mutation') {
    const message = 'Cannot perform \'find\' actions with a GraphQL \'mutation\'';
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }

  if (!isFind && operation === 'query') {
    const message = 'Can only perform \'find\' actions with a GraphQL \'query\'';
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }
};

const isFindQuery = function ({ name }) {
  return name.value.startsWith('find') || name.value === '__schema';
};

const getOperationNames = function ({ selections }) {
  return selections
    .map(({ name: { value } = {} }) => value)
    .join(', ');
};

const getFragments = function ({ queryDocument: { definitions } }) {
  return definitions.filter(({ kind }) => kind === 'FragmentDefinition');
};

module.exports = {
  getMainDef,
};
