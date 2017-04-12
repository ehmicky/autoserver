'use strict';


const { execute } = require('graphql');

const { getSchema } = require('../schema');


const getHandleIntrospection = function ({ idl }) {
  const schema = getSchema({ idl });
  return async function ({ queryDocument, variables, operationName }) {
    const response = await execute(schema, queryDocument, {}, {}, variables, operationName);
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
