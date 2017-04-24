'use strict';


const { parse } = require('graphql');

const { EngineError } = require('../../../error');
const { memoize } = require('../../../utilities');


// Raw GraphQL parsing
const parseQuery = memoize(function ({ query, operation, operationName }) {
  if (!query) {
    throw new EngineError('Missing GraphQL query', { reason: 'GRAPHQL_NO_QUERY' });
  }

  try {
    const queryDocument = parse(query);
    const { graphqlOperation } = validateQuery({ queryDocument, operation, operationName });
    return { queryDocument, graphqlOperation };
  } catch (innererror) {
    throw new EngineError('Could not parse GraphQL query', { reason: 'GRAPHQL_SYNTAX_ERROR', innererror });
  }
});

// Make sure GraphQL query is valid
const validateQuery = function ({ queryDocument, operation, operationName }) {
  // Get all query|mutation definitions
  const definitions = queryDocument.definitions.filter(({ name: { value: name } = {}, kind }) => {
    return kind === 'OperationDefinition' && (!operationName || name === operationName);
  });
  if (definitions.length === 0) {
    if (operationName) {
      throw new EngineError(`Could not find GraphQL operation ${operationName}`, { reason: 'GRAPHQL_SYNTAX_ERROR' });
    } else {
      throw new EngineError('Missing GraphQL query', { reason: 'GRAPHQL_NO_QUERY' });
    }
  }

  // TODO: We do not support multiple queries yet
  const definition = definitions[0];

  if (operation === 'GET' && definition.operation !== 'query') {
    throw new EngineError('Can only perform GraphQL queries, not mutations, when using GET method', {
      reason: 'GRAPHQL_SYNTAX_ERROR',
    });
  }

  return { graphqlOperation: definition.operation };
};


module.exports = {
  parseQuery,
  validateQuery,
};
