'use strict';

const {
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLString,
} = require('graphql');

const { throwError } = require('../../../../../error');
const { stringifyJSON } = require('../../../../../utilities');

const { graphQLRequiredTest, graphQLRequiredTGetter } = require('./required');
const { graphQLArrayTest, graphQLArrayTGetter } = require('./array');
const { graphQLObjectTGetter } = require('./object');

// Maps an IDL definition into a GraphQL type.
// The first matching one will be used, i.e. order matters:
// required modifier, then array modifier come first
const graphQLTGetters = [

  // "Required" modifier type
  {
    condition: graphQLRequiredTest,
    value: graphQLRequiredTGetter,
  },

  // "Array" modifier type
  {
    condition: graphQLArrayTest,
    value: graphQLArrayTGetter,
  },

  // "Object" type
  {
    condition: def => def.type === 'object',
    value: graphQLObjectTGetter,
  },

  // "Int" type
  {
    condition: def => def.type === 'integer',
    value: () => GraphQLInt,
  },

  // "Float" type
  {
    condition: def => def.type === 'number',
    value: () => GraphQLFloat,
  },

  // "String" type
  {
    condition: def => def.type === 'string' || def.type === 'null',
    value: () => GraphQLString,
  },

  // "Boolean" type
  {
    condition: def => def.type === 'boolean',
    value: () => GraphQLBoolean,
  },

];

const getTypeGetter = function ({ def, opts }) {
  const typeGetter = graphQLTGetters.find(possibleType =>
    possibleType.condition(def, opts)
  );

  if (!typeGetter) {
    const message = `Could not parse attribute into a GraphQL type: ${stringifyJSON(def)}`;
    throwError(message, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }

  return typeGetter;
};

module.exports = {
  getTypeGetter,
};
