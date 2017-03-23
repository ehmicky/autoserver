'use strict';


const { RoutesManager } = require('./manager');


const routes = [
  { path: '/graphiql', route: 'graphiql' },
  { path: '/graphql', route: 'graphql' },
  { path: '/graphql/schema', route: 'graphqlschema' },
];
const manager = new RoutesManager(routes);


module.exports = {
  routes: manager,
};
