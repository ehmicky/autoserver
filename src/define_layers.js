'use strict';


const middleware = require('./middleware');

const routingHandler = require('./protocol/routing');
const protocolHandler = require('./protocol/protocol');
const loggingHandler = require('./interface/logging');
const interfaceHandler = require('./interface/interface');


const start = middleware.chain([
  routingHandler,
  protocolHandler,
  loggingHandler,
  interfaceHandler,
]);


module.exports = {
  start,
};