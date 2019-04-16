import { startServer } from './start.js'
import { stopServer } from './stop.js'
import { getUrl, getOrigin } from './origin.js'
import { getQueryString } from './query_string.js'
import { getHeaders } from './headers.js'
import { getMethod } from './method.js'
import { getPath } from './path.js'
import { getPayload, hasPayload } from './payload/main.js'
import { send } from './send/main.js'
import { getIp } from './ip.js'
import { getInput } from './input.js'
import { opts } from './opts.js'
// eslint-disable-next-line import/max-dependencies
import { defaults } from './defaults.js'

export const http = {
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
