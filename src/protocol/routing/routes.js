'use strict';


const { RoutesManager } = require('./manager');


const routes = [
  { path: '/graphiql', route: 'graphiql' },
  { path: '/graphql', route: 'graphql' },
];
const manager = new RoutesManager(routes);


module.exports = {
  routes: manager,
};
