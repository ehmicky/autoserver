'use strict';

const opts = require('./opts');
const { startServer } = require('./start');
const { stopServer, countPendingRequests } = require('./stop');
const { getRequestheaders } = require('./headers');
const { getPayload, hasPayload } = require('./payload');
const { getOrigin, getPath, getQueryString } = require('./url');
const { getMethod } = require('./method');
const { send } = require('./send');
const { getIp } = require('./ip');
const { args } = require('./args');

const protocol = {
  opts,
  name: 'http',
  title: 'HTTP',
  description: 'HTTP server\'s options',
  startServer,
  stopServer,
  countPendingRequests,
  getRequestheaders,
  getPayload,
  hasPayload,
  getOrigin,
  getPath,
  getQueryString,
  getMethod,
  send,
  getIp,
  args,
};

module.exports = protocol;
