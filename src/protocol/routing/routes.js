'use strict';


const { RoutesManager } = require('./manager');


const routes = [
  { path: '/graphiql', route: 'graphiql' },
  { path: '/graphql', route: 'graphql' },
  { path: '/entity/:entityId/yo/:ya/*/ah/(maybe)?/oh/:surely+', route: 'entity' },
];
const manager = new RoutesManager(routes);


module.exports = {
  routes: manager,
};
