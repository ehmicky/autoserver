'use strict';

const opts = require('./opts');
const { startServer } = require('./start');
const { stopServer, countPendingRequests } = require('./stop');
const {
  getRequestheaders,
  getResponseheaders,
  setResponseheaders,
} = require('./headers');
const {
  getPayload,
  hasPayload,
  getContentType,
  getCharset,
} = require('./payload');
const { getOrigin, getPath, getQueryString } = require('./url');
const { getMethod } = require('./method');
const { send } = require('./send');
const { getIp } = require('./ip');
const { args } = require('./args');
const {
  getProtocolstatus,
  getStatus,
  failureProtocolstatus,
// eslint-disable-next-line import/max-dependencies
} = require('./status');

const protocol = {
  opts,
  name: 'http',
  title: 'HTTP',
  description: 'HTTP server\'s options',
  startServer,
  stopServer,
  countPendingRequests,
  getRequestheaders,
  getResponseheaders,
  setResponseheaders,
  getPayload,
  hasPayload,
  getContentType,
  getCharset,
  getOrigin,
  getPath,
  getQueryString,
  getMethod,
  send,
  getIp,
  args,
  getProtocolstatus,
  getStatus,
  failureProtocolstatus,
};

module.exports = protocol;
