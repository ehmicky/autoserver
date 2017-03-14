'use strict';


const { chain, test } = require('./middleware');

const routingHandler = require('./protocol/routing');
const protocolHandler = require('./protocol/protocol');
const loggingHandler = require('./interface/logging');
const { handleGraphQL, handleGraphiQL } = require('./interface/graphql');


const start = chain([
  routingHandler,
  protocolHandler,
  loggingHandler,
  test(handleGraphQL.condition, handleGraphQL),
  test(handleGraphiQL.condition, handleGraphiQL),
]);


module.exports = {
  start,
};