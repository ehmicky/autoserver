'use strict';

const {
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLString,
} = require('graphql');

const { throwError } = require('../../../../error');
const { stringifyJSON } = require('../../../../utilities');

const { graphQLRequiredFGetter } = require('./required');
const { graphQLArrayFGetter } = require('./array');
const { graphQLObjectFGetter } = require('./object');

/**
 * Maps an IDL definition into a GraphQL field information, including type
 * The first matching one will be used, i.e. order matters:
 * required modifier, then array modifier come first
 */
const graphQLFGetters = [

  // "Required" modifier type
  {
    condition: (def, opts) => opts.isRequired,
    value: graphQLRequiredFGetter,
  },

  // "Array" modifier type
  {
    condition: def => def.multiple,
    value: graphQLArrayFGetter,
  },

  // "Object" type
  {
    condition: def => def.type === 'object',
    value: graphQLObjectFGetter,
  },

  // "Int" type
  {
    condition: def => def.type === 'integer',
    value: () => ({ type: GraphQLInt }),
  },

  // "Float" type
  {
    condition: def => def.type === 'number',
    value: () => ({ type: GraphQLFloat }),
  },

  // "String" type
  {
    condition: def => def.type === 'string' || def.type === 'null',
    value: () => ({ type: GraphQLString }),
  },

  // "Boolean" type
  {
    condition: def => def.type === 'boolean',
    value: () => ({ type: GraphQLBoolean }),
  },

];

const getFieldGetter = function ({ def, opts }) {
  const fieldGetter = graphQLFGetters.find(possibleType =>
    possibleType.condition(def, opts)
  );

  if (!fieldGetter) {
    const message = `Could not parse attribute into a GraphQL type: ${stringifyJSON(def)}`;
    throwError(message, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }

  return fieldGetter;
};

module.exports = {
  getFieldGetter,
};
