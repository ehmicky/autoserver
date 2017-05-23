'use strict';


const { parse } = require('graphql');

const { EngineError } = require('../../../../error');
const { memoize } = require('../../../../utilities');


// Raw GraphQL parsing
const parseQuery = memoize(function ({ query, method, operationName }) {
  if (!query) {
    throw new EngineError('Missing GraphQL query', { reason: 'GRAPHQL_NO_QUERY' });
  }

  try {
    const queryDocument = parse(query);
    const { graphqlMethod } = validateQuery({ queryDocument, method, operationName });
    return { queryDocument, graphqlMethod };
  } catch (innererror) {
    throw new EngineError('Could not parse GraphQL query', { reason: 'GRAPHQL_SYNTAX_ERROR', innererror });
  }
});

// Make sure GraphQL query is valid
const validateQuery = function ({ queryDocument, method, operationName }) {
  // Get all query|mutation definitions
  const operationDefinitions = queryDocument.definitions.filter(({ kind }) => kind === 'OperationDefinition');
  const definitions = operationDefinitions.filter(({ name: { value: name } = {} }) => {
    return !operationName || name === operationName;
  });
  if (definitions.length === 0) {
    if (operationName) {
      throw new EngineError(`Could not find GraphQL operation ${operationName}`, { reason: 'GRAPHQL_SYNTAX_ERROR' });
    } else {
      throw new EngineError('Missing GraphQL query', { reason: 'GRAPHQL_NO_QUERY' });
    }
  }
  const definition = definitions[0];

  // GraphQL-anywhere do not support operationName yet, so we must patch it until they do
  // See https://github.com/apollographql/graphql-anywhere/issues/34
  if (operationDefinitions.length > 1) {
    queryDocument.definitions = queryDocument.definitions.filter(def => {
      return !operationDefinitions.includes(def) || def === definition;
    });
  }

  if (method === 'GET' && definition.operation !== 'query') {
    throw new EngineError('Can only perform GraphQL queries, not mutations, when using GET method', {
      reason: 'GRAPHQL_SYNTAX_ERROR',
    });
  }

  return { graphqlMethod: definition.operation };
};


module.exports = {
  parseQuery,
  validateQuery,
};
