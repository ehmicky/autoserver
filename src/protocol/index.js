'use strict';


const { router } = require('./router');
const { routingHandler: httpRoutingHandler, protocolHandler: httpProtocolHandler } = require('./http');
const { loggingHandler } = require('./logging');


module.exports = {
  router,
  loggingHandler,
  http: {
    routingHandler: httpRoutingHandler,
    protocolHandler: httpProtocolHandler,
  },
};