'use strict';


const { RoutesManager } = require('./manager');


const getRoutes = function () {
  const routes = [
    { method: 'find', path: '/graphiql', route: 'graphiql' },
    { method: ['find', 'create'], path: '/graphql', route: 'graphql' },
    { method: 'find', path: '/graphql/schema', route: 'graphqlprint' },
  ];
  const manager = new RoutesManager(routes);
  return manager;
};


module.exports = {
  getRoutes,
};
