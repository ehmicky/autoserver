import { GraphQLBoolean } from 'graphql'

// `silent` argument
export const getSilentArgument = function () {
  return SILENT_ARGS
}

const SILENT_ARGS = {
  silent: {
    type: GraphQLBoolean,
    description: `Do not output any result.
The action is still performed.`,
    defaultValue: false,
  },
}
