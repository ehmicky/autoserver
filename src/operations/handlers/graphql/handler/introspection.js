'use strict';

const { execute } = require('graphql');

const { throwError, addGenErrorHandler } = require('../../../../error');

// At the moment, we do not support mixing introspection query with
// non-introspection query, except for `__typename`
// This means that `__schema` must be the only top-level properties
// when specified
const isIntrospectionQuery = function ({ operationDef: { commandName } }) {
  return commandName === '__schema';
};

// Handle GraphQL introspection query by using the GraphQL schema object
const handleIntrospection = async function ({
  graphQLSchema,
  queryDocument,
  variables,
  operationName,
}) {
  const content = await eGetIntrospectionResp({
    graphQLSchema,
    queryDocument,
    variables,
    operationName,
  });

  const { errors: [innererror] = [] } = content;

  if (innererror) {
    throwError('GraphQL introspection query failed', {
      reason: 'INPUT_SERVER_VALIDATION',
      innererror,
    });
  }

  return { response: { content, type: 'model' } };
};

const getIntrospectionResp = function ({
  graphQLSchema,
  queryDocument,
  variables,
  operationName,
}) {
  return execute(
    graphQLSchema,
    queryDocument,
    {},
    {},
    variables,
    operationName,
  );
};

// Exception can be fired in several ways by GraphQL.js:
//  - throwing an exception
//  - returning errors in response
const eGetIntrospectionResp = addGenErrorHandler(getIntrospectionResp, {
  message: 'GraphQL introspection query failed',
  reason: 'INPUT_SERVER_VALIDATION',
});

module.exports = {
  isIntrospectionQuery,
  handleIntrospection,
};
