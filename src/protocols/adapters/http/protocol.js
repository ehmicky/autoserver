'use strict';

const opts = require('./opts');
const { startServer } = require('./start');
const { stopServer, countPendingRequests } = require('./stop');
const { getUrl, getOrigin } = require('./origin');
const { getQueryString } = require('./query_string');
const { getHeaders } = require('./headers');
const { getMethod } = require('./method');
const { getPath } = require('./path');
const { getPayload, hasPayload } = require('./payload');
const { send } = require('./send');
const { getIp } = require('./ip');
// eslint-disable-next-line import/max-dependencies
const { input } = require('./input');

const protocol = {
  opts,
  name: 'http',
  title: 'HTTP',
  description: 'HTTP server\'s options',
  startServer,
  stopServer,
  countPendingRequests,
  getUrl,
  getOrigin,
  getQueryString,
  getHeaders,
  getMethod,
  getPath,
  getPayload,
  hasPayload,
  send,
  getIp,
  input,
};

module.exports = protocol;
