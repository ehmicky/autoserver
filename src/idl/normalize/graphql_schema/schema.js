'use strict';


const { GraphQLSchema } = require('graphql');

const { memoize, mapValues } = require('../../../utilities');
const { getType } = require('./types');
const { getModelsByGraphqlMethod } = require('./models');
const { nameSym } = require('./name');


// Returns GraphQL schema
const getSchema = memoize(function ({
  idl: { models },
  serverOpts: {
    defaultPageSize,
    maxPageSize,
  },
}) {
  // Apply `getType` to each top-level graphqlMethod, i.e. Query and Mutation
  const schemaFields = mapValues(rootDefs, (rootDef, graphqlMethod) => {
    // Builds query|mutation type
    const def = getGraphqlMethodDef({ rootDef, graphqlMethod, models });
    return getType(def, { defaultPageSize, maxPageSize });
  });

  const schema = new GraphQLSchema(schemaFields);
  return schema;
});

const rootDefs = {
  query: {
    description: 'Fetches information about different entities',
    name: 'Query',
  },
  mutation: {
    description: 'Modifies information about different entities',
    name: 'Mutation',
  },
};

const getGraphqlMethodDef = function ({
  rootDef: { description, name },
  graphqlMethod,
  models,
}) {
  const properties = getModelsByGraphqlMethod({ graphqlMethod, models });
  return {
    type: 'object',
    [nameSym]: name,
    description,
    properties,
    isTopLevel: true,
  };
};


module.exports = {
  getSchema,
};
