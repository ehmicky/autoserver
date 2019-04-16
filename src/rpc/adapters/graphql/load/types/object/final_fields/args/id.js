import { GraphQLString } from 'graphql'

import { getArgTypeDescription } from '../../../../description.js'

// `id` argument
export const getIdArgument = function(def) {
  const hasId = ID_COMMAND_TYPES.includes(def.command)

  if (!hasId) {
    return {}
  }

  const description = getArgTypeDescription(def, 'argId')

  const args = getIdArgs({ description })
  return args
}

const ID_COMMAND_TYPES = ['find', 'delete', 'patch']

const getIdArgs = ({ description }) => ({
  id: {
    type: GraphQLString,
    description,
  },
})
