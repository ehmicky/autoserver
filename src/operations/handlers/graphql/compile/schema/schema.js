'use strict';

const { GraphQLSchema } = require('graphql');
const { v4: uuidv4 } = require('uuid');

const { mapValues } = require('../../../../../utilities');

const { getType } = require('./type');
const { getModelDefs } = require('./models');

// Returns GraphQL schema
const getSchema = function ({ models }) {
  const topDefs = getTopDefs({ models });
  const topTypes = getTopTypes({ topDefs });
  const schema = new GraphQLSchema(topTypes);
  return schema;
};

const getTopDefs = function ({ models }) {
  return mapValues(topDefsInit, (topDef, topDefName) => {
    const attributes = getModelDefs({ graphqlMethod: topDefName, models });
    return { ...topDef, attributes };
  });
};

const commonTopDefsInit = {
  kind: 'graphqlMethod',
  type: 'object',
};

const topDefsInit = {
  query: {
    ...commonTopDefsInit,
    description: 'Fetches information about different entities',
    typeName: 'Query',
  },
  mutation: {
    ...commonTopDefsInit,
    description: 'Modifies information about different entities',
    typeName: 'Mutation',
  },
};

// Builds query|mutation type
const getTopTypes = function ({ topDefs }) {
  const schemaId = uuidv4();

  return mapValues(topDefs, topDef =>
    getType(topDef, { topDef, schemaId })
  );
};

module.exports = {
  getSchema,
};
