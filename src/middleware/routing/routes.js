'use strict';


const { RoutesManager } = require('./manager');


const getRoutes = function () {
  /* eslint-disable no-multi-spaces */
  const routes = [
    { method: 'GET',            path: '/graphiql',        route: 'graphiql'     },
    { method: ['GET', 'POST'],  path: '/graphql',         route: 'graphql'      },
    { method: 'GET',            path: '/graphql/schema',  route: 'graphqlprint' },
  ];
  /* eslint-enable no-multi-spaces */
  const manager = new RoutesManager(routes);
  return manager;
};


module.exports = {
  getRoutes,
};
