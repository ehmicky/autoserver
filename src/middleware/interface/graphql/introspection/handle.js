'use strict';


const { execute } = require('graphql');

const { EngineError } = require('../../../../error');
const { getSchema } = require('../schema');


const getHandleIntrospection = function ({ idl }) {
  const schema = getSchema({ idl });
  return async function ({ queryDocument, variables, operationName }) {
    let response;
    try {
      response = await execute(schema, queryDocument, {}, {}, variables, operationName);
    // Exception can be fired in several ways by GraphQL.js:
    //  - throwing an exception
    //  - returning errors in response
    } catch (exception) {
      throw new EngineError(exception, { reason: 'GRAPHQL_WRONG_INTROSPECTION_SCHEMA' });
    }
    if (response.errors) {
      throw new EngineError(response.errors[0].message, { reason: 'GRAPHQL_WRONG_INTROSPECTION_SCHEMA' });
    }
    return response;
  };
};

/**
 * At the moment, we do not support mixing introspection query with non-introspection query, except for `__typename`
 * This means that `__schema` or `__type` must be the only top-level properties when specified
 **/
const introspectionQueryRegExp = /(\b__schema\b)|(\b__type\s*\()/;
const isIntrospectionQuery = function ({ query }) {
  return introspectionQueryRegExp.test(query);
};


module.exports = {
  getHandleIntrospection,
  isIntrospectionQuery,
};
