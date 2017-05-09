'use strict';


const { GraphQLSchema } = require('graphql');
const { mapValues } = require('lodash');

const { memoize } = require('../../../utilities');
const { getType } = require('./types');
const { getModelsByMethod } = require('./models');
const { nameSym } = require('./name');


// Returns GraphQL schema
const getSchema = memoize(function ({ idl: { models } }) {
  // Apply `getType` to each top-level action, i.e. Query and Mutation
  const schemaFields = mapValues(rootDefs, (rootDef, methodName) => {
    // Builds query|mutation type
    const def = getMethodDef({ rootDef, methodName, models });
    return getType(def);
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

const getMethodDef = function ({ rootDef: { description, name }, methodName, models }) {
  const properties = getModelsByMethod({ methodName, models });
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
