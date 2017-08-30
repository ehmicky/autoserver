'use strict';

const { graphql: anywhere } = require('./anywhere');

// Executes GraphQL request
const handleQuery = async function ({
  resolver,
  queryDocument,
  variables,
  context: ctx,
  rootValue,
}) {
  // GraphQL execution
  const response = await anywhere(
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
