'use strict';


const { chain, branch } = require('../middleware');

const {
  http: {
    routingHandler: httpRoutingHandler,
    protocolHandler: httpProtocolHandler,
  },
  router: protocolRouter,
  loggingHandler,
} = require('../protocol');

const {
  graphql: {
    graphQLHandler,
    graphiQLHandler,
  },
  router: interfaceRouter,
} = require('../interface');


const start = chain([

  // Protocol layer
  branch(protocolRouter, {
    http: [
      httpRoutingHandler,
      httpProtocolHandler,
    ],
  }),
  loggingHandler,

  // Interface layer
  branch(interfaceRouter, {
    graphql: graphQLHandler,
    graphiql: graphiQLHandler,
  }),

]);


module.exports = {
  start,
};