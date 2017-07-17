'use strict';

const { execute } = require('graphql');

const { EngineError } = require('../../../../error');

const handleIntrospection = async function ({
  schema,
  queryDocument,
  variables,
  operationName,
}) {
  let response;

  try {
    response = await execute(
      schema,
      queryDocument,
      {},
      {},
      variables,
      operationName,
    );
  // Exception can be fired in several ways by GraphQL.js:
  //  - throwing an exception
  //  - returning errors in response
  } catch (exception) {
    throwError(exception);
  }

  if (response.errors && response.errors[0]) {
    throwError(response.errors[0]);
  }

  return response;
};

const throwError = function (innererror) {
  throw new EngineError('GraphQL introspection query failed', {
    reason: 'GRAPHQL_WRONG_INTROSPECTION_SCHEMA',
    innererror,
  });
};

// At the moment, we do not support mixing introspection query with
// non-introspection query, except for `__typename`
// This means that `__schema` or `__type` must be the only top-level properties
// when specified
const introspectionQueryRegExp = /(\b__schema\b)|(\b__type\s*\()/;

const isIntrospectionQuery = function ({ query }) {
  return introspectionQueryRegExp.test(query);
};

module.exports = {
  handleIntrospection,
  isIntrospectionQuery,
};
