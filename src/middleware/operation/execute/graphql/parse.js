'use strict';

const { parse } = require('graphql');

const { throwError } = require('../../../../error');
const { memoize } = require('../../../../utilities');

// Raw GraphQL parsing
const parseQuery = memoize(({ query, goal, operationName }) => {
  if (!query) {
    const message = 'Missing GraphQL query';
    throwError(message, { reason: 'GRAPHQL_NO_QUERY' });
  }

  try {
    return getQueryDocument({ query, goal, operationName });
  } catch (error) {
    const message = 'Could not parse GraphQL query';
    throwError(message, {
      reason: 'GRAPHQL_SYNTAX_ERROR',
      innererror: error,
    });
  }
});

const getQueryDocument = function ({ query, goal, operationName }) {
  const queryDocument = parse(query);

  const operationDefinitions = getOperationDefinitions({ queryDocument });
  const definition = getDefinition({ operationDefinitions, operationName });

  const queryDocumentA = patchQueryDocument({
    operationDefinitions,
    definition,
    queryDocument,
  });

  const graphqlMethod = definition.operation;
  validateQuery({ graphqlMethod, goal });

  return { queryDocument: queryDocumentA, graphqlMethod };
};

// Get all query|mutation definitions
const getOperationDefinitions = function ({ queryDocument }) {
  return queryDocument.definitions.filter(({ kind }) =>
    kind === 'OperationDefinition'
  );
};

const getDefinition = function ({ operationDefinitions, operationName }) {
  const definition = operationDefinitions.find(
    ({ name: { value: name } = {} }) =>
      !operationName || name === operationName
  );
  if (definition) { return definition; }

  if (operationName) {
    const message = `Could not find GraphQL operation '${operationName}'`;
    throwError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }

  if (!operationName) {
    const message = 'Missing GraphQL query';
    throwError(message, { reason: 'GRAPHQL_NO_QUERY' });
  }
};

// GraphQL-anywhere do not support operationName yet,
// so we must patch it until they do
// See https://github.com/apollographql/graphql-anywhere/issues/34
const patchQueryDocument = function ({
  operationDefinitions,
  definition,
  queryDocument,
}) {
  if (operationDefinitions.length <= 1) { return queryDocument; }

  const definitions = queryDocument.definitions.filter(def =>
    !operationDefinitions.includes(def) || def === definition
  );

  return { ...queryDocument, definitions };
};

// Make sure GraphQL query is valid
const validateQuery = function ({ graphqlMethod, goal }) {
  if (goal === 'find' && graphqlMethod !== 'query') {
    const message = 'Can only perform GraphQL queries, not mutations, with the current protocol method';
    throwError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }
};

module.exports = {
  parseQuery,
};
