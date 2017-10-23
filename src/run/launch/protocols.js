'use strict';

const { protocolHandlers } = require('../../protocols');

// Can use runOpts.protocols.PROTOCOL.enabled {boolean}
const getProtocolHandlers = function ({ runOpts }) {
  return Object.values(protocolHandlers)
    .filter(({ name }) => runOpts.protocols[name].enabled !== false);
};

module.exports = {
  getProtocolHandlers,
};
