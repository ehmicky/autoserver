'use strict';

const { GraphQLSchema } = require('graphql');
const { v4: uuidv4 } = require('uuid');

const { memoize, mapValues } = require('../../../../utilities');

const { getType } = require('./types');
const { getModelsByGraphqlMethod } = require('./models');
const { nameSym } = require('./name');

// Returns GraphQL schema
const getSchema = function ({
  idl: { models },
  serverOpts: {
    defaultPageSize,
    maxPageSize,
  },
}) {
  const schemaId = uuidv4();

  // Apply `getType` to each top-level graphqlMethod, i.e. Query and Mutation
  const schemaFields = mapValues(rootDefs, (rootDef, graphqlMethod) => {
    // Builds query|mutation type
    const def = getGraphqlMethodDef({ rootDef, graphqlMethod, models });
    const opts = { defaultPageSize, maxPageSize, rootDef: def, schemaId };
    return getType(def, opts);
  });

  const schema = new GraphQLSchema(schemaFields);
  return schema;
};

const mGetSchema = memoize(getSchema);

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
  getSchema: mGetSchema,
};
