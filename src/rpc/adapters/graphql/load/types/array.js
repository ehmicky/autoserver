import { GraphQLList } from 'graphql'

export const graphqlArrayTest = ({ arrayWrapped, command, isArray }) => {
  // Already wrapped in Array type
  if (arrayWrapped) {
    return false
  }

  // Nested collections' attributes
  if (isArray !== undefined) {
    return isArray
  }

  // Top-level commands
  if (command !== undefined) {
    return true
  }

  // Query|Mutation types
  return false
}

// Array field TGetter
export const graphqlArrayTGetter = (def, opts) => {
  const defA = { ...def, arrayWrapped: true }
  const subType = opts.getType(defA, opts)
  const type = new GraphQLList(subType)
  return type
}
