import { features } from './features.js'
import { disconnect } from './disconnect.js'
import { connect } from './connect.js'
import { query } from './query/main.js'
import { check } from './check.js'
import { defaults } from './defaults.js'
import { opts } from './opts.js'

const memory = {
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

module.exports = {
  memory,
}
