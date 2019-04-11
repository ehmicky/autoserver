'use strict'

const { parse } = require('./parse')

const rpc = {
  name: 'graphqlprint',
  title: 'GraphQLPrint',
  routes: ['/graphql/schema'],
  methods: ['GET'],
  parse,
}

module.exports = rpc
