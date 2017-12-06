'use strict';

const { execute } = require('graphql');

const { throwError, addGenErrorHandler } = require('../../../../error');

// At the moment, we do not support mixing introspection query with
// non-introspection query, except for `__typename`
// This means that `__schema` must be the only top-level properties
// when specified
const isIntrospectionQuery = function ({ rpcDef: { commandName } }) {
  return commandName === '__schema';
};

// Handle GraphQL introspection query by using the GraphQL schema object
const handleIntrospection = async function ({
  graphqlSchema,
  queryDocument,
  variables,
  operationName,
}) {
  const { data, errors: [innererror] = [] } = await eGetIntrospectionResp({
    graphqlSchema,
    queryDocument,
    variables,
    operationName,
  });

  if (innererror) {
    throwError('GraphQL introspection query failed', {
      reason: 'SERVER_INPUT_VALIDATION',
      innererror,
    });
  }

  const response = { type: 'model', content: data };

  return {
    response,
    summary: 'find_introspection',
    commandpaths: [''],
    collnames: ['__schema'],
    clientCollnames: ['__schema'],
  };
};

const getIntrospectionResp = function ({
  graphqlSchema,
  queryDocument,
  variables,
  operationName,
}) {
  return execute(
    graphqlSchema,
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
  reason: 'SERVER_INPUT_VALIDATION',
});

module.exports = {
  isIntrospectionQuery,
  handleIntrospection,
};
