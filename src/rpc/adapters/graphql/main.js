const { parse } = require('./parse/main.js')
const { transformSuccess, transformError } = require('./response')
const { load } = require('./load/main.js')

const graphql = {
  name: 'graphql',
  title: 'GraphQL',
  routes: ['/graphql'],
  methods: ['GET', 'POST'],
  parse,
  transformSuccess,
  transformError,
  load,
}

module.exports = {
  graphql,
}
