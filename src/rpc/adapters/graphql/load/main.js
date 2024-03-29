import { GraphQLSchema } from 'graphql'

import { getTopDefs } from './top_defs.js'
import { getTopTypes } from './type.js'

// Add GraphQL schema, so it can be used by introspection, and by graphqlPrint
export const load = ({ config: { collections } }) => {
  const topDefs = getTopDefs({ collections })
  const topTypes = getTopTypes({ topDefs })
  const graphqlSchema = new GraphQLSchema(topTypes)
  return { graphqlSchema }
}
