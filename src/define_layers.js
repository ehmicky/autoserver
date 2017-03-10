'use strict';


const layers = require('./layers');
const routingHandler = require('./protocol/routing');
const protocolHandler = require('./protocol/protocol');
const loggingHandler = require('./interface/logging');
const interfaceHandler = require('./interface/interface');


const start = function () {
  layers.defineLayers({
    groupsOrder: ['protocol', 'interface'],
    groups: {
      protocol: {
        layers: [
          { name: 'routing', handler: routingHandler },
          { name: 'protocol', handler: protocolHandler },
        ],
      },
      interface: {
        layers: [
          { name: 'logging', handler: loggingHandler },
          { name: 'interface', handler: interfaceHandler },
        ],
      },
    },
  });
};


module.exports = {
  start,
};