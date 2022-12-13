import { GraphQLString } from 'graphql'

// `order` argument
export const getOrderArgument = ({ command, features }) => {
  const canOrder =
    ORDER_COMMAND_TYPES.has(command) && features.includes('order')

  if (!canOrder) {
    return {}
  }

  return ORDER_ARGS
}

const ORDER_COMMAND_TYPES = new Set(['find'])

const ORDER_ARGS = {
  order: {
    type: GraphQLString,
    description: `Sort results according to this attribute.
Specify ascending or descending order by appending + or - (default is ascending)
Several attributes can specified, by using a comma-separated list.`,
    defaultValue: 'id+',
  },
}
