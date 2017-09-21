'use strict';

const { execute } = require('graphql');

const { throwError, addGenErrorHandler } = require('../../../../error');

const { getTopLevelAction } = require('./utilities');

// At the moment, we do not support mixing introspection query with
// non-introspection query, except for `__typename`
// This means that `__schema` must be the only top-level properties
// when specified
const isIntrospectionQuery = function ({ actions }) {
  const { actionPath: [actionName] } = getTopLevelAction({ actions });
  return actionName === '__schema';
};

const handleIntrospection = async function ({
  schema,
  queryDocument,
  variables,
  operationName,
}) {
  const content = await eGetIntrospectionResp({
    schema,
    queryDocument,
    variables,
    operationName,
  });

  const { errors: [innererror] = [] } = content;

  if (innererror) {
    throwError('GraphQL introspection query failed', {
      reason: 'GRAPHQL_INTROSPECTION',
      innererror,
    });
  }

  return { response: { content, type: 'model' } };
};

const getIntrospectionResp = function ({
  schema,
  queryDocument,
  variables,
  operationName,
}) {
  return execute(schema, queryDocument, {}, {}, variables, operationName);
};

// Exception can be fired in several ways by GraphQL.js:
//  - throwing an exception
//  - returning errors in response
const eGetIntrospectionResp = addGenErrorHandler(getIntrospectionResp, {
  message: 'GraphQL introspection query failed',
  reason: 'GRAPHQL_INTROSPECTION',
});

module.exports = {
  isIntrospectionQuery,
  handleIntrospection,
};
