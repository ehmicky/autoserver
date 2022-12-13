import { GraphQLString } from 'graphql'

// `cascade` argument
export const getCascadeArgument = ({ command }) => {
  const hasCascade = CASCADE_COMMANDS.has(command)

  if (!hasCascade) {
    return {}
  }

  return CASCADE_ARGS
}

const CASCADE_COMMANDS = new Set(['delete'])

const CASCADE_ARGS = {
  cascade: {
    type: GraphQLString,
    description: `Also delete specified nested collections.
Each attribute can use dot-delimited notation to specify deeply nested collections.
Several attributes can specified, by using a comma-separated list.`,
  },
}
