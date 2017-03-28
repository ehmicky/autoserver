'use strict';


const { RoutesManager } = require('./manager');


const getRoutes = function () {
  const routes = [
    { path: '/graphiql', route: 'graphiql' },
    { path: '/graphql', route: 'graphql' },
    { path: '/graphql/schema', route: 'graphqlprint' },
  ];
  const manager = new RoutesManager(routes);
  return manager;
};


module.exports = {
  getRoutes,
};