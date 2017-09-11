'use strict';

const { parse } = require('graphql');

const { throwError, addGenErrorHandler } = require('../../../../error');

// Raw GraphQL parsing
const parseQuery = function ({ query, goal, operationName }) {
  if (!query) {
    const message = 'Missing GraphQL query';
    throwError(message, { reason: 'GRAPHQL_NO_QUERY' });
  }

  return eGetQueryDocument({ query, goal, operationName });
};

const getQueryDocument = function ({ query, goal, operationName }) {
  const queryDocument = parse(query);

  const mainDef = getMainDef({ queryDocument, operationName });

  validateQuery({ mainDef, goal });

  return { queryDocument, mainDef };
};

const eGetQueryDocument = addGenErrorHandler(getQueryDocument, {
  message: 'Could not parse GraphQL query',
  reason: 'GRAPHQL_SYNTAX_ERROR',
});

const getMainDef = function ({ queryDocument, operationName }) {
  const mainDef = queryDocument.definitions
    .filter(({ kind }) => kind === 'OperationDefinition')
    .find(({ name: { value: name } = {} }) =>
      !operationName || name === operationName
    );
  if (mainDef) { return mainDef; }

  if (operationName) {
    const message = `Could not find GraphQL operation '${operationName}'`;
    throwError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }

  const msg = 'Missing GraphQL query';
  throwError(msg, { reason: 'GRAPHQL_NO_QUERY' });
};

// Make sure GraphQL query is valid
const validateQuery = function ({ mainDef, goal }) {
  if (goal === 'find' && mainDef.operation !== 'query') {
    const message = 'Can only perform GraphQL queries, not mutations, with the current protocol method';
    throwError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }
};

module.exports = {
  parseQuery,
};
