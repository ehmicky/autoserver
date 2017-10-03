'use strict';

const { GraphQLSchema } = require('graphql');
const { v4: uuidv4 } = require('uuid');

const { mapValues } = require('../../../../../utilities');

const { getTopDefs } = require('./top_defs');
const { getType } = require('./type');

// Returns GraphQL schema
const getSchema = function ({ models }) {
  const topDefs = getTopDefs({ models });
  const topTypes = getTopTypes({ topDefs });
  const schema = new GraphQLSchema(topTypes);
  return schema;
};

// Builds query|mutation type
const getTopTypes = function ({ topDefs }) {
  const schemaId = uuidv4();

  return mapValues(
    topDefs,
    topDef => getType(topDef, { topDef, schemaId, inputObjectType: 'type' }),
  );
};

module.exports = {
  getSchema,
};
