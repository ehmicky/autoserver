'use strict'

const { parse } = require('./parse')
const { transformSuccess, transformError } = require('./response')
const { load } = require('./load')

const rpc = {
  name: 'graphql',
  title: 'GraphQL',
  routes: ['/graphql'],
  methods: ['GET', 'POST'],
  parse,
  transformSuccess,
  transformError,
  load,
}

module.exports = rpc
