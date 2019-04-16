import { parse } from './parse/main.js'

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
