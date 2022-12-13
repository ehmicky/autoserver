import { execute } from 'graphql'

// At the moment, we do not support mixing introspection query with
// non-introspection query, except for `__typename`
// This means that `__schema` must be the only top-level properties
// when specified
export const isIntrospectionQuery = ({ rpcDef: { commandName } }) =>
  commandName === '__schema'

// Handle GraphQL introspection query by using the GraphQL schema object
export const handleIntrospection = async ({
  graphqlSchema,
  queryDocument,
  variables,
  operationName,
}) => {
  const { data, errors: [innererror] = [] } = await getIntrospectionResp({
    graphqlSchema,
    queryDocument,
    variables,
    operationName,
  })

  // Exception can be fired in several ways by GraphQL.js:
  //  - throwing an exception
  //  - returning errors in response
  if (innererror) {
    throw innererror
  }

  const response = { type: 'model', content: data }

  return {
    response,
    summary: 'find_introspection',
    commandpaths: [''],
    collnames: ['__schema'],
    clientCollnames: ['__schema'],
  }
}

const getIntrospectionResp = ({
  graphqlSchema,
  queryDocument,
  variables,
  operationName,
}) => execute(graphqlSchema, queryDocument, {}, {}, variables, operationName)
