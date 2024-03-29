import { GraphQLJSON } from 'graphql-type-json'

// `params` argument
export const getParamsArgument = () => PARAMS_ARGS

const PARAMS_ARGS = {
  params: {
    type: GraphQLJSON,
    description: 'Custom parameters passed to database logic',
  },
}
