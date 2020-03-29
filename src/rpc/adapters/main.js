import { graphiql } from './graphiql/main.js'
import { graphql } from './graphql/main.js'
import { graphqlprint } from './graphqlprint/main.js'
import { jsonrpc } from './jsonrpc/main.js'
import { rest } from './rest/main.js'

export const RPC_ADAPTERS = [rest, graphql, graphiql, graphqlprint, jsonrpc]
