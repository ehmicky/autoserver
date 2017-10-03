'use strict';

const {
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLString,
} = require('graphql');

const { throwError } = require('../../../../../../error');

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
    condition: def => def.type === 'string',
    value: () => GraphQLString,
  },

  // "Boolean" type
  {
    condition: def => def.type === 'boolean',
    value: () => GraphQLBoolean,
  },

];

const getTypeGetter = function ({ def, opts }) {
  const typeGetter = graphQLTGetters
    .find(({ condition }) => condition(def, opts));

  if (typeGetter === undefined) {
    const message = `Could not parse attribute into a GraphQL type: ${JSON.stringify(def)}`;
    throwError(message, { reason: 'IDL_SYNTAX_ERROR' });
  }

  return typeGetter;
};

module.exports = {
  getTypeGetter,
};
