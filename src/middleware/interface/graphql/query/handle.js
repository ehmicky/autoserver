'use strict';


const { default: graphqlAnywhere } = require('graphql-anywhere');

const { getModelsMap } = require('../../../../idl');
const { getSchema } = require('../introspection');
const { getResolver } = require('./resolver');
const { parseQuery } = require('./parse');


/**
 * Executes GraphQL request
 */
const getHandleQuery = ({ idl }) => {
  const schema = getSchema({ idl });
  const modelsMap = getModelsMap({ idl });
  const resolver = getResolver({ modelsMap, schema });

  return async function ({ query, variables, context, rootValue }) {
    // GraphQL parsing
    const { queryDocument } = parseQuery({ query });
    // GraphQL execution
    const response = graphqlAnywhere(resolver, queryDocument, rootValue, context, variables);
    return response;
  };
};


module.exports = {
  getHandleQuery,
};
