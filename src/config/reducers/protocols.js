'use strict';

const { protocolAdapters } = require('../../protocols');

const { validateAdaptersOpts } = require('./adapter_opts');

// Validates `protocols.PROTOCOL.*`
const validateProtocols = function ({ config: { protocols } }) {
  validateAdaptersOpts({
    opts: protocols,
    adapters: protocolAdapters,
    key: 'protocols',
  });
};

module.exports = {
  validateProtocols,
};
