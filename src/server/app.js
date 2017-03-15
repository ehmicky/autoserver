'use strict';


const { chain, branch } = require('../middleware');

const { http, router: protocolRouter, loggingHandler } = require('../protocol');

const { graphql, router: interfaceRouter } = require('../interface');


const start = chain([
  branch(protocolRouter, {
    http: http.routingHandler,
  }),
  branch(protocolRouter, {
    http: http.protocolHandler,
  }),
  loggingHandler,
  branch(interfaceRouter, {
    graphql: graphql.graphQLHandler,
    graphiql: graphql.graphiQLHandler,
  }),
]);


module.exports = {
  start,
};