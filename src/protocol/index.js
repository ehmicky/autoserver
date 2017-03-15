'use strict';


const { router } = require('./router');
const { routingHandler: httpRoutingHandler, protocolHandler: httpProtocolHandler } = require('./http');


module.exports = {
  router,
  http: {
    routingHandler: httpRoutingHandler,
    protocolHandler: httpProtocolHandler,
  },
};