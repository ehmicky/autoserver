/* jscpd:ignore-start */
import { check } from './check.js'
import { connect } from './connect.js'
import { defaults } from './defaults.js'
import { disconnect } from './disconnect.js'
import { features } from './features.js'
import { opts } from './opts.js'
import { query } from './query/main.js'
/* jscpd:ignore-end */

export const memory = {
  name: 'memory',
  title: 'In-Memory',
  description: 'In-memory database. For development purpose only.',
  features,
  connect,
  check,
  disconnect,
  query,
  defaults,
  opts,
}
