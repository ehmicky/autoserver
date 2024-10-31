import { defaults } from './defaults.js'
import { getHeaders } from './headers.js'
import { getInput } from './input.js'
import { getIp } from './ip.js'
import { getMethod } from './method.js'
import { opts } from './opts.js'
import { getOrigin, getUrl } from './origin.js'
import { getPath } from './path.js'
import { getPayload, hasPayload } from './payload/main.js'
import { getQueryString } from './query_string.js'
import { send } from './send/main.js'
import { startServer } from './start.js'
// eslint-disable-next-line import/max-dependencies
import { stopServer } from './stop.js'

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
