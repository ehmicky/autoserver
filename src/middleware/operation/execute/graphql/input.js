'use strict';

const { parse } = require('graphql');

const { throwError, addGenErrorHandler } = require('../../../../error');

const getGraphQLInput = function ({ queryVars, payload }) {
  // Parameters can be in either query variables or payload
  // (including by using application/graphql)
  const payloadA = typeof payload === 'object' ? payload : {};
  const { query, variables, operationName } = { ...queryVars, ...payloadA };

  const queryDocument = parseQuery({ query });

  return { query, variables, operationName, queryDocument };
};

// GraphQL parsing
const parseQuery = function ({ query }) {
  if (!query) {
    const message = 'Missing GraphQL query';
    throwError(message, { reason: 'GRAPHQL_NO_QUERY' });
  }

  return eParse(query);
};

const eParse = addGenErrorHandler(parse, {
  message: 'Could not parse GraphQL query',
  reason: 'GRAPHQL_SYNTAX_ERROR',
});

module.exports = {
  getGraphQLInput,
};
