'use strict';


const { RoutesManager } = require('./manager');


const getRoutes = function () {
  const routes = [
    { method: 'GET', path: '/graphiql', route: 'graphiql' },
    { method: ['GET', 'POST'], path: '/graphql', route: 'graphql' },
    { method: 'GET', path: '/graphql/schema', route: 'graphqlprint' },
  ];
  const manager = new RoutesManager(routes);
  return manager;
};


module.exports = {
  getRoutes,
};
