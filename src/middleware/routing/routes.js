'use strict';


const { RoutesManager } = require('./manager');


const getRoutes = function () {
  const routes = [
    { operation: 'GET', path: '/graphiql', route: 'graphiql' },
    { operation: ['GET', 'POST'], path: '/graphql', route: 'graphql' },
    { operation: 'GET', path: '/graphql/schema', route: 'graphqlprint' },
  ];
  const manager = new RoutesManager(routes);
  return manager;
};


module.exports = {
  getRoutes,
};
