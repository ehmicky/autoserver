'use strict';

const { parse } = require('graphql');

const { throwError, addGenErrorHandler } = require('../../../../error');

// Generic GraphQL parsing
const getGraphQLDocument = function ({ queryVars, payload }) {
  // Parameters can be in either query variables or payload
  // (including by using application/graphql)
  const payloadA = parsePayload({ payload });
  const { query, variables, operationName } = { ...queryVars, ...payloadA };

  const queryDocument = eParseQuery({ query });

  return { variables, operationName, queryDocument };
};

const parsePayload = function ({ payload }) {
  // MIME type: application/graphql
  if (typeof payload === 'string') {
    return { query: payload };
  }

  // MIME type: application/json
  if (payload && payload.constructor === Object) {
    return payload;
  }
};

const parseQuery = function ({ query }) {
  if (!query) {
    throwError('Missing GraphQL query');
  }

  return parse(query);
};

const eParseQuery = addGenErrorHandler(parseQuery, {
  message: 'Could not parse GraphQL query',
  reason: 'SYNTAX_VALIDATION',
});

module.exports = {
  getGraphQLDocument,
};
