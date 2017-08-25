'use strict';

const { protocols } = require('../../protocols');

// Can use runOpts.PROTOCOL.enabled {boolean}
const getProtocols = function ({ runOpts }) {
  return protocols.filter(isEnabledProtocol.bind(null, runOpts));
};

const isEnabledProtocol = function (runOpts, protocol) {
  const { enabled } = runOpts[protocol.toLowerCase()];
  return enabled;
};

module.exports = {
  getProtocols,
};
