'use strict';

const opts = require('./opts');
const { startServer } = require('./start');
const { stopServer, countPendingRequests } = require('./stop');
const { getHeaders } = require('./headers');
const { getPayload, hasPayload } = require('./payload');
const { getOrigin, getPath, getQueryString } = require('./url');
const { getMethod } = require('./method');
const { send } = require('./send');
const { getIp } = require('./ip');
const { input } = require('./input');

const protocol = {
  opts,
  name: 'http',
  title: 'HTTP',
  description: 'HTTP server\'s options',
  startServer,
  stopServer,
  countPendingRequests,
  getHeaders,
  getPayload,
  hasPayload,
  getOrigin,
  getPath,
  getQueryString,
  getMethod,
  send,
  getIp,
  input,
};

module.exports = protocol;
