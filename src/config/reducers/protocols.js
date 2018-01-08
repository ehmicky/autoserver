'use strict';

const { PROTOCOL_OPTS } = require('../../protocols');

const { validateAdaptersOpts } = require('./adapter_opts');

// Validates `protocols.PROTOCOL.*`
const validateProtocols = function ({ config: { protocols } }) {
  validateAdaptersOpts({
    opts: protocols,
    adaptersOpts: PROTOCOL_OPTS,
    key: 'protocols',
  });
};

module.exports = {
  validateProtocols,
};
