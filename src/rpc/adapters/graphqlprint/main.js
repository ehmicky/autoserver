const { parse } = require('./parse/main.js')

const graphqlprint = {
  name: 'graphqlprint',
  title: 'GraphQLPrint',
  routes: ['/graphql/schema'],
  methods: ['GET'],
  parse,
}

module.exports = {
  graphqlprint,
}
