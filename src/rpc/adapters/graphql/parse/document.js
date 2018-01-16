'use strict';

const { parse } = require('graphql');

const { isObject } = require('../../../../utilities');
const { throwError, addGenErrorHandler } = require('../../../../errors');

// Generic/raw GraphQL parsing
const getGraphqlDocument = function ({ queryvars, payload }) {
  const payloadA = parsePayload({ payload });
  // Parameters can be in either query variables or payload
  const { query, variables, operationName } = { ...queryvars, ...payloadA };

  const queryDocument = parseQuery({ query });

  return { variables, operationName, queryDocument };
};

// GraphQL payload can either be:
//   - a JSON with `query`, `variables` and `operationName`
//     with MIME type application/json
//   - the `query` directly, as a string with MIME type application/graphql
const parsePayload = function ({ payload }) {
  if (payload === undefined) { return; }

  if (typeof payload === 'string') {
    return { query: payload };
  }

  if (isObject(payload)) {
    return payload;
  }

  const message = 'Invalid request format: payload must be an object or a GraphQL query string';
  throwError(message, { reason: 'PAYLOAD_NEGOTIATION' });
};

// Transform GraphQL query string into AST
const parseQuery = function ({ query }) {
  if (!query) {
    throwError('Missing GraphQL query');
  }

  return parse(query);
};

const eGetGraphqlDocument = addGenErrorHandler(getGraphqlDocument, {
  message: 'Could not parse GraphQL query',
  reason: 'VALIDATION',
});

module.exports = {
  getGraphqlDocument: eGetGraphqlDocument,
};
