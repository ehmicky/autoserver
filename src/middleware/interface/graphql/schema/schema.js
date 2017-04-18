'use strict';


const { GraphQLSchema } = require('graphql');
const { mapValues } = require('lodash');
const uuidv4 = require('uuid/v4');

const { memoize } = require('../../../../utilities');
const { getType } = require('./types');
const { getModelsByMethod } = require('./models');


// Returns GraphQL schema
const getSchema = memoize(function ({ idl }) {
  const schemaId = uuidv4();

  // Apply `getType` to each top-level operation, i.e. Query and Mutation
  const schemaFields = mapValues(rootDef, (def, methodName) => {
    // Adds query|mutation.properties
    def.properties = getModelsByMethod(methodName, { idl });
    // Returns query|mutation type
    return getType(def, { methodName, schemaId });
  });

  const schema = new GraphQLSchema(schemaFields);
  return schema;
});

const rootDef = {
  query: {
    type: 'object',
    description: 'Fetches information about different entities',
  },
  mutation: {
    type: 'object',
    description: 'Modifies information about different entities',
  },
};


module.exports = {
  getSchema,
};
