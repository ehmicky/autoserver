const { rest } = require('./rest/main.js')
const { graphql } = require('./graphql/main.js')
const { graphiql } = require('./graphiql/main.js')
const { graphqlprint } = require('./graphqlprint/main.js')
const { jsonrpc } = require('./jsonrpc/main.js')

const RPC_ADAPTERS = [rest, graphql, graphiql, graphqlprint, jsonrpc]

module.exports = {
  RPC_ADAPTERS,
}
