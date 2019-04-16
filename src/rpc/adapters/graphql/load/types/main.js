import {
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLString,
} from 'graphql'

import { throwError } from '../../../../../errors/main.js'

import { graphqlRequiredTest, graphqlRequiredTGetter } from './required.js'
import { graphqlArrayTest, graphqlArrayTGetter } from './array.js'
import { graphqlObjectTGetter } from './object/main.js'

// Maps an config definition into a GraphQL type.
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
]

export const getTypeGetter = function(def, opts) {
  const typeGetter = graphqlTGetters.find(({ condition }) =>
    condition(def, opts),
  )

  if (typeGetter !== undefined) {
    return typeGetter
  }

  const message = `Could not parse attribute into a GraphQL type: ${JSON.stringify(
    def,
  )}`
  throwError(message, { reason: 'CONFIG_VALIDATION' })
}
