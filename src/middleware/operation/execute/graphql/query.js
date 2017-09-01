'use strict';

const { graphql: anywhere } = require('./anywhere');

// Executes GraphQL request
const handleQuery = async function ({
  resolver,
  queryDocument,
  variables,
  graphqlDef,
  callback,
}) {
  // GraphQL execution
  const response = await anywhere(
    resolver,
    queryDocument,
    graphqlDef,
    { graphqlDef, callback },
    variables
  );
  return response;
};

module.exports = {
  handleQuery,
};
