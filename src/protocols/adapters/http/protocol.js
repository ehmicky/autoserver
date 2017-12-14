'use strict';

const { startServer } = require('./start');
const { stopServer } = require('./stop');
const { getUrl, getOrigin } = require('./origin');
const { getQueryString } = require('./query_string');
const { getHeaders } = require('./headers');
const { getMethod } = require('./method');
const { getPath } = require('./path');
const { getPayload, hasPayload } = require('./payload');
const { send } = require('./send');
const { getIp } = require('./ip');
const { input } = require('./input');
const opts = require('./opts');
// eslint-disable-next-line import/max-dependencies
const defaults = require('./defaults');

const protocol = {
  name: 'http',
  title: 'HTTP',
  description: 'HTTP server\'s options',
  startServer,
  stopServer,
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
  opts,
  defaults,
};

module.exports = protocol;
