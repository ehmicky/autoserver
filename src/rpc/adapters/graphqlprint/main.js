import { parse } from './parse/main.js'

export const graphqlprint = {
  name: 'graphqlprint',
  title: 'GraphQLPrint',
  routes: ['/graphql/schema'],
  methods: ['GET'],
  parse,
}
