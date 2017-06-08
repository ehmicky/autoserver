'use strict';


const { RoutesManager } = require('./manager');


const getRoutes = function () {
  const routes = [
    { method: 'find', path: '/graphiql', route: 'GraphiQL' },
    { method: ['find', 'create'], path: '/graphql', route: 'GraphQL' },
    { method: 'find', path: '/graphql/schema', route: 'GraphQLPrint' },
  ];
  const manager = new RoutesManager(routes);
  return manager;
};


module.exports = {
  getRoutes,
};
