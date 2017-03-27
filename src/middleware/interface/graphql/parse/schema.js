'use strict';


const { GraphQLSchema } = require('graphql');
const { mapValues } = require('lodash');

const { GeneralCache } = require('../../../../utilities');
const { getIdl } = require('../../../../idl');
const { getType } = require('./types');
const { getModelsByMethod } = require('./models');


// Returns GraphQL schema
const getSchema = function (definitions, opts) {
  const idl = getIdl(definitions);
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
  return schema;
};

const rootDef = {
  query: {
    title: 'Query',
    type: 'object',
    description: 'Fetches information about different entities',
  },
  mutation: {
    title: 'Mutation',
    type: 'object',
    description: 'Modifies information about different entities',
  },
};


module.exports = {
  graphqlGetSchema: getSchema,
};