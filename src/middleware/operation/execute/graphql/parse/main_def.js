'use strict';

const { throwError } = require('../../../../../error');

const getMainDef = function ({ queryDocument, operationName, goal }) {
  const mainDef = queryDocument.definitions
    .filter(({ kind }) => kind === 'OperationDefinition')
    .find(({ name: { value: name } = {} }) =>
      !operationName || name === operationName
    );

  validateMainDef({ mainDef, operationName, goal });

  return mainDef;
};

const validateMainDef = function ({ mainDef, operationName, goal }) {
  if (!mainDef && operationName) {
    const message = `Could not find GraphQL operation '${operationName}'`;
    throwError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }

  if (!mainDef) {
    const message = 'Missing GraphQL query';
    throwError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }

  if (goal === 'find' && mainDef.operation !== 'query') {
    const message = 'Can only perform GraphQL queries, not mutations, with the current protocol method';
    throwError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }
};

const getFragments = function ({ queryDocument: { definitions } }) {
  return definitions.filter(({ kind }) => kind === 'FragmentDefinition');
};

module.exports = {
  getMainDef,
  getFragments,
};
