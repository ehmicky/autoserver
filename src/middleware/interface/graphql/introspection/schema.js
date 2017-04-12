'use strict';


const { GraphQLSchema } = require('graphql');
const { mapValues } = require('lodash');

const { GeneralCache } = require('../../../../utilities');
const { stringify } = require('circular-json');
const { getType } = require('./types');
const { getModelsByMethod } = require('./models');


const schemaCache = new GeneralCache();

// Returns GraphQL schema
const getSchema = function ({ idl }) {
  const schemaCacheKey = stringify(idl);
  if (schemaCache.exists(schemaCacheKey)) {
    return schemaCache.get(schemaCacheKey);
  }

  // Each schema gets its own cache instance, to avoid leaking
  const cache = new GeneralCache();

  // Apply `getType` to each top-level operation, i.e. Query and Mutation
  const schemaFields = mapValues(rootDef, (def, methodName) => {
    // Adds query|mutation.properties
    def.properties = getModelsByMethod(methodName, { idl });
    // Returns query|mutation type
    return getType(def, { cache });
  });

  const schema = new GraphQLSchema(schemaFields);
  schemaCache.set(schemaCacheKey, schema);
  return schema;
};

const rootDef = {
  query: {
    propName: 'query',
    type: 'object',
    description: 'Fetches information about different entities',
  },
  mutation: {
    propName: 'mutation',
    type: 'object',
    description: 'Modifies information about different entities',
  },
};


module.exports = {
  getSchema,
};
