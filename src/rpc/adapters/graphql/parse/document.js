import { parse } from 'graphql'

import { addCatchAllHandler } from '../../../../errors/handler.js'
import { throwPb } from '../../../../errors/props.js'
import { isObject } from '../../../../utils/functional/type.js'

// Generic/raw GraphQL parsing
const eGetGraphqlDocument = ({ queryvars, payload }) => {
  const payloadA = parsePayload({ payload })
  // Parameters can be in either query variables or payload
  const { query, variables, operationName } = { ...queryvars, ...payloadA }

  const queryDocument = parseQuery({ query })

  return { variables, operationName, queryDocument }
}

// GraphQL payload can either be:
//   - a JSON with `query`, `variables` and `operationName`
//     with MIME type application/json
//   - the `query` directly, as a string with MIME type application/graphql
const parsePayload = ({ payload }) => {
  if (payload === undefined) {
    return
  }

  if (typeof payload === 'string') {
    return { query: payload }
  }

  if (isObject(payload)) {
    return payload
  }

  const message =
    'Invalid request payload: it must be an object or a GraphQL query string'
  throwPb({ reason: 'REQUEST_NEGOTIATION', message, extra: { kind: 'type' } })
}

// Transform GraphQL query string into AST
const parseQuery = ({ query }) => {
  if (!query) {
    throwPb({ reason: 'VALIDATION', message: 'Missing GraphQL query' })
  }

  return parse(query)
}

const getGraphqlHandler = (error) => {
  throwPb({
    reason: 'VALIDATION',
    message: 'Could not parse GraphQL query',
    innererror: error,
  })
}

export const getGraphqlDocument = addCatchAllHandler(
  eGetGraphqlDocument,
  getGraphqlHandler,
)
