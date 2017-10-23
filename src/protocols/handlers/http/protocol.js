'use strict';

const opts = require('./opts');
const { getFullName } = require('./fullname');
const { startServer } = require('./start');
const { stopServer, countPendingRequests } = require('./stop');
const { parseHeaders, sendHeaders } = require('./headers');
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
  getProtocolStatus,
  getStatus,
  failureProtocolStatus,
// eslint-disable-next-line import/max-dependencies
} = require('./status');

const protocol = {
  opts,
  name: 'http',
  title: 'HTTP',
  description: 'HTTP server\'s options',
  getFullName,
  startServer,
  stopServer,
  countPendingRequests,
  parseHeaders,
  sendHeaders,
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
  getProtocolStatus,
  getStatus,
  failureProtocolStatus,
};

module.exports = protocol;
