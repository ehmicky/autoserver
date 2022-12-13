import { parseRpcDef } from './definition/main.js'
import { getGraphqlDocument } from './document.js'
import { getFragments } from './fragments.js'
import { isIntrospectionQuery, handleIntrospection } from './introspection.js'
import { getMainDef } from './main_def.js'
import { validateMainDef } from './validate.js'

// Use GraphQL-specific logic to parse the request into an rpc-agnostic `rpcDef`
export const parse = ({
  config: { graphqlSchema },
  queryvars,
  payload,
  method,
}) => {
  const { variables, operationName, queryDocument } = getGraphqlDocument({
    queryvars,
    payload,
  })

  const mainDef = getMainDef({ queryDocument, operationName })
  validateMainDef({ mainDef, operationName, method })
  const fragments = getFragments({ queryDocument })

  const rpcDef = parseRpcDef({ mainDef, variables, fragments })

  // Introspection GraphQL query do not need to query the database,
  // and return right away
  if (isIntrospectionQuery({ rpcDef })) {
    return handleIntrospection({
      graphqlSchema,
      queryDocument,
      variables,
      operationName,
    })
  }

  return { rpcDef }
}
