'use strict'

const { parse } = require('./parse')

const rpc = {
  name: 'graphiql',
  title: 'GraphiQL',
  methods: ['GET'],
  routes: ['/graphiql'],
  parse,
}

module.exports = rpc
