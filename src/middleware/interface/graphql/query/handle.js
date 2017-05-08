'use strict';


const { default: graphqlAnywhere } = require('graphql-anywhere');

const { getModelsMap } = require('../../../../idl');
const { getResolver } = require('./resolver');


/**
 * Executes GraphQL request
 */
const getHandleQuery = ({ idl }) => {
  const modelsMap = getModelsMap({ idl });

  return async function ({ queryDocument, variables, context, rootValue }) {
    const metadata = new Map();
    const resolver = getResolver({ modelsMap, metadata });
    // GraphQL execution
    const data = await graphqlAnywhere(resolver, queryDocument, rootValue, context, variables);
    return { data, metadata };
  };
};


module.exports = {
  getHandleQuery,
};
