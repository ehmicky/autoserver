'use strict';

const { GraphQLSchema } = require('graphql');

const { getTopDefs } = require('./top_defs');
const { getTopTypes } = require('./type');

// Returns GraphQL schema
const getSchema = function ({ models }) {
  const topDefs = getTopDefs({ models });
  const topTypes = getTopTypes({ topDefs });
  const schema = new GraphQLSchema(topTypes);
  return schema;
};

module.exports = {
  getSchema,
};
