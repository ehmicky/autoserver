'use strict';

const {
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLString,
} = require('graphql');

const { throwError } = require('../../../../../../error');

const { graphqlRequiredTest, graphqlRequiredTGetter } = require('./required');
const { graphqlArrayTest, graphqlArrayTGetter } = require('./array');
const { graphqlObjectTGetter } = require('./object');

// Maps an schema definition into a GraphQL type.
// The first matching one will be used, i.e. order matters:
// required modifier, then array modifier come first
const graphqlTGetters = [

  // "Required" modifier type
  {
    condition: graphqlRequiredTest,
    value: graphqlRequiredTGetter,
  },

  // "Array" modifier type
  {
    condition: graphqlArrayTest,
    value: graphqlArrayTGetter,
  },

  // "Object" type
  {
    condition: def => def.type === 'object',
    value: graphqlObjectTGetter,
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

const getTypeGetter = function (def, opts) {
  const typeGetter = graphqlTGetters
    .find(({ condition }) => condition(def, opts));

  if (typeGetter === undefined) {
    const message = `Could not parse attribute into a GraphQL type: ${JSON.stringify(def)}`;
    throwError(message, { reason: 'SCHEMA_SYNTAX_ERROR' });
  }

  return typeGetter;
};

module.exports = {
  getTypeGetter,
};
