'use strict';


const { default: graphqlAnywhere } = require('graphql-anywhere');

const { getModelsMap } = require('../../../../../idl');
const { getResolver } = require('./resolver');


/**
 * Executes GraphQL request
 */
const getHandleQuery = ({ idl }) => {
  const modelsMap = getModelsMap({ idl });

  return async function ({ queryDocument, variables, context, rootValue }) {
    const resolver = getResolver({ modelsMap });
    // GraphQL execution
    const response = await graphqlAnywhere(
      resolver,
      queryDocument,
      rootValue,
      context,
      variables
    );
    return response;
  };
};


module.exports = {
  getHandleQuery,
};
