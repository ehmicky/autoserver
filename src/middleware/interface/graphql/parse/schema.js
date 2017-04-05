'use strict';


const { GraphQLSchema } = require('graphql');
const { mapValues } = require('lodash');

const { GeneralCache, stringify } = require('../../../../utilities');
const { getType } = require('./types');
const { getModelsByMethod } = require('./models');


const schemaCache = new GeneralCache();

// Returns GraphQL schema
const getSchema = function (idl, opts) {
  const schemaCacheKey = stringify(idl);
  if (schemaCache.exists(schemaCacheKey)) {
    return schemaCache.get(schemaCacheKey);
  }

  // Each schema gets its own cache instance, to avoid leaking
  const cache = new GeneralCache();

  // Apply `getType` to each top-level operation, i.e. Query and Mutation
  const schemaFields = mapValues(rootDef, (def, methodName) => {
    // Adds query|mutation.properties
    def.properties = getModelsByMethod(methodName, Object.assign({ idl }, opts));
    // Returns query|mutation type
    return getType(def, Object.assign({ cache }, opts));
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
  graphqlGetSchema: getSchema,
};
