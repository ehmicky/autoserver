'use strict';

const { protocolAdapters } = require('../../../protocols');

const { getDynamicOpts } = require('./dynamic');

const protocols = getDynamicOpts({
  name: 'protocols',
  title: 'Protocol',
  handlers: protocolAdapters,
});

module.exports = protocols;
