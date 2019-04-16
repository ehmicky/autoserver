const { parse } = require('./parse/main.js')

const graphiql = {
  name: 'graphiql',
  title: 'GraphiQL',
  methods: ['GET'],
  routes: ['/graphiql'],
  parse,
}

module.exports = {
  graphiql,
}
