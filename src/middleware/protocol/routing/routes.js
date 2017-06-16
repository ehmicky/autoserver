'use strict';


const routes = [
  { goal: 'find', path: '/graphiql', name: 'GraphiQL' },
  { goal: ['find', 'create'], path: '/graphql', name: 'GraphQL' },
  { goal: 'find', path: '/graphql/schema', name: 'GraphQLPrint' },
];


module.exports = {
  routes,
};
