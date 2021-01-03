import { GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import moize from 'moize'

import { getTypeName } from '../../name.js'

import { getObjectFields } from './fields.js'

// Object field TGetter
const mGraphqlObjectTGetter = function (def, opts) {
  const Type =
    opts.inputObjectType === 'type' ? GraphQLObjectType : GraphQLInputObjectType

  const name = getTypeName({ def, opts })
  const { description } = def

  // This needs to be a function, otherwise we run in an infinite recursion,
  // if the children try to reference a parent type
  const fields = getObjectFields.bind(undefined, { ...opts, parentDef: def })

  const type = new Type({ name, description, fields })
  return type
}

// Memoize object type constructor in order to infinite recursion.
// We use the type name, i.e.:
//  - type name must differ everytime type might differ
//  - in particular, at the moment, type name differ when inputObjectType
//    or command changes
// We also namespace with a UUID which is unique for each new call to
// `getGraphqlSchema()`, to avoid leaking
const transformArgs = function ([def, opts]) {
  const typeName = getTypeName({ def, opts })
  return `${opts.graphqlSchemaId}/${typeName}`
}

export const graphqlObjectTGetter = moize(mGraphqlObjectTGetter, {
  transformArgs,
  maxSize: Number.POSITIVE_INFINITY,
})
