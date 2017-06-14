'use strict';


const { RoutesManager } = require('./manager');


const getRoutes = function () {
  const manager = new RoutesManager({ routes });
  return manager;
};

const routes = [
  { goal: 'find', path: '/graphiql', name: 'GraphiQL' },
  { goal: ['find', 'create'], path: '/graphql', name: 'GraphQL' },
  { goal: 'find', path: '/graphql/schema', name: 'GraphQLPrint' },
];


module.exports = {
  getRoutes,
};
