'use strict';


const { chain, branch } = require('../middleware');

const { http, router: protocolRouter, loggingHandler } = require('../protocol');

const { graphql, router: interfaceRouter } = require('../interface');


const start = chain([

  // Protocol layer
  branch(protocolRouter, {
    http: [
      http.routingHandler,
      http.protocolHandler,
    ],
  }),
  loggingHandler,

  // Interface layer
  branch(interfaceRouter, {
    graphql: graphql.graphQLHandler,
    graphiql: graphql.graphiQLHandler,
  }),

]);


module.exports = {
  start,
};