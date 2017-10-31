'use strict';

const { protocolHandlers } = require('../../../protocols');

const { getDynamicOpts } = require('./dynamic');

const protocols = getDynamicOpts({
  name: 'protocols',
  title: 'Protocol',
  handlers: protocolHandlers,
});

module.exports = protocols;
