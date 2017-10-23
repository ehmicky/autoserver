'use strict';

const { protocolHandlers } = require('../../../protocols');

const { getDynamicOpts } = require('./dynamic');

const protocols = getDynamicOpts({
  name: 'protocols',
  title: 'Protocol',
  handlers: protocolHandlers,
  defaultValue: { http: {} },
});

module.exports = protocols;
