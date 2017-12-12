'use strict';

const { GraphQLSchema } = require('graphql');

const { getTopDefs } = require('./top_defs');
const { getTopTypes } = require('./type');

// Add GraphQL schema, so it can be used by introspection, and by graphqlPrint
const load = function ({ config: { collections } }) {
  const topDefs = getTopDefs({ collections });
  const topTypes = getTopTypes({ topDefs });
  const graphqlSchema = new GraphQLSchema(topTypes);
  return { graphqlSchema };
};

module.exports = {
  load,
};
