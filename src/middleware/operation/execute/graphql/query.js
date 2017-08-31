'use strict';

const { graphql: anywhere } = require('./anywhere');

// Executes GraphQL request
const handleQuery = async function ({
  resolver,
  queryDocument,
  variables,
  graphqlDef,
  callback,
  rootValue,
}) {
  // GraphQL execution
  const response = await anywhere(
    resolver,
    queryDocument,
    rootValue,
    graphqlDef,
    { graphqlDef, callback },
    variables
  );
  return response;
};

module.exports = {
  handleQuery,
};
