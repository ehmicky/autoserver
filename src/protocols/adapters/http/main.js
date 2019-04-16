const { startServer } = require('./start')
const { stopServer } = require('./stop')
const { getUrl, getOrigin } = require('./origin')
const { getQueryString } = require('./query_string')
const { getHeaders } = require('./headers')
const { getMethod } = require('./method')
const { getPath } = require('./path')
const { getPayload, hasPayload } = require('./payload/main.js')
const { send } = require('./send/main.js')
const { getIp } = require('./ip')
const { getInput } = require('./input')
const { opts } = require('./opts')
// eslint-disable-next-line import/max-dependencies
const { defaults } = require('./defaults')

const http = {
  name: 'http',
  title: 'HTTP',
  description: "HTTP server's options",
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
  getInput,
  opts,
  defaults,
}

module.exports = {
  http,
}
