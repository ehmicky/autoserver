'use strict';

const opts = require('./opts');
const { startServer } = require('./start');
const { stopServer, countPendingRequests } = require('./stop');
const {
  getRequestheaders,
  getResponseHeaders,
  setResponseHeaders,
} = require('./headers');
const {
  parsePayload,
  hasPayload,
  getContentType,
  getContentLength,
} = require('./payload');
const { getOrigin, getPath, getQueryString } = require('./url');
const { getMethod } = require('./method');
const { send } = require('./send');
const { getIp } = require('./ip');
const { getArgs } = require('./args');
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
  getResponseHeaders,
  setResponseHeaders,
  parsePayload,
  hasPayload,
  getContentType,
  getContentLength,
  getOrigin,
  getPath,
  getQueryString,
  getMethod,
  send,
  getIp,
  getArgs,
  getProtocolstatus,
  getStatus,
  failureProtocolstatus,
};

module.exports = protocol;
