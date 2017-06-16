'use strict';


const { default: graphqlAnywhere } = require('graphql-anywhere');


/**
 * Executes GraphQL request
 */
const handleQuery = async function ({
  resolver,
  queryDocument,
  variables,
  context,
  rootValue,
}) {
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


module.exports = {
  handleQuery,
};
