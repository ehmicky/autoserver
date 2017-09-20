'use strict';

const { throwError } = require('../../../../error');

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

const getDef = function ({ definitions, operationName }) {
  return definitions
    .filter(({ kind }) => kind === 'OperationDefinition')
    .find(({ name: { value: name } = {} }) =>
      !operationName || name === operationName
    );
};

const validateMainDef = function ({ mainDef, operationName }) {
  if (!mainDef && operationName) {
    const message = `Could not find GraphQL operation '${operationName}'`;
    throwError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }

  if (!mainDef) {
    const message = 'Missing GraphQL query';
    throwError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }
};

const validateMainSelection = function ({
  mainDef: { selectionSet: { selections }, operation },
  method,
}) {
  if (selections.length > 1) {
    const names = getOperationNames({ selections });
    const message = `Cannot perform several GraphQL operations at once: ${names}`;
    throwError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }

  if (selections[0].kind !== 'Field') {
    const message = 'Cannot use a GraphQL fragment as the main operation';
    throwError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }

  if (method === 'find' && operation !== 'query') {
    const message = 'Can only perform GraphQL queries, not mutations, with the current protocol method';
    throwError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }
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
