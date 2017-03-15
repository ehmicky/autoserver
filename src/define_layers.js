'use strict';


const { chain, branch } = require('./middleware');

const routingHandler = require('./protocol/routing');
const protocolHandler = require('./protocol/protocol');
const { router: interfaceRouter } = require('./interface');
const loggingHandler = require('./interface/logging');
const { handleGraphQL, handleGraphiQL } = require('./interface/graphql');


const start = chain([
  routingHandler,
  protocolHandler,
  loggingHandler,
  branch(interfaceRouter, {
    graphql: handleGraphQL,
    graphiql: handleGraphiQL,
  }),
]);


module.exports = {
  start,
};