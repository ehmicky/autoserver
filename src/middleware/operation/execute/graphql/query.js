'use strict';

const { graphql: graphqlAnywhere } = require('./graphql-anywhere');

// Executes GraphQL request
const handleQuery = async function ({
  resolver,
  queryDocument,
  variables,
  context: ctx,
  rootValue,
}) {
  // GraphQL execution
  const response = await graphqlAnywhere(
    resolver,
    queryDocument,
    rootValue,
    ctx,
    variables
  );
  return response;
};

module.exports = {
  handleQuery,
};
