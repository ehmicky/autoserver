import { rest } from './rest/main.js'
import { graphql } from './graphql/main.js'
import { graphiql } from './graphiql/main.js'
import { graphqlprint } from './graphqlprint/main.js'
import { jsonrpc } from './jsonrpc/main.js'

const RPC_ADAPTERS = [rest, graphql, graphiql, graphqlprint, jsonrpc]

module.exports = {
  RPC_ADAPTERS,
}
