'use strict';


const { RoutesManager } = require('./manager');


const getRoutes = function () {
  const routes = [
    { goal: 'find', path: '/graphiql', route: 'GraphiQL' },
    { goal: ['find', 'create'], path: '/graphql', route: 'GraphQL' },
    { goal: 'find', path: '/graphql/schema', route: 'GraphQLPrint' },
  ];
  const manager = new RoutesManager(routes);
  return manager;
};


module.exports = {
  getRoutes,
};
