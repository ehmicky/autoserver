'use strict';


const { default: graphqlAnywhere } = require('graphql-anywhere');

const { getModelsMap } = require('../../../../idl');
const { getResolver } = require('./resolver');


/**
 * Executes GraphQL request
 */
const getHandleQuery = ({ idl }) => {
  const modelsMap = getModelsMap({ idl });
  const resolver = getResolver({ modelsMap });

  return async function ({ queryDocument, variables, context, rootValue }) {
    // GraphQL execution
    const response = graphqlAnywhere(resolver, queryDocument, rootValue, context, variables);
    return response;
  };
};


module.exports = {
  getHandleQuery,
};
