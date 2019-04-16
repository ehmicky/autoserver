import { features } from './features.js'
import { connect } from './connect.js'
import { disconnect } from './disconnect.js'
import { query } from './query/main.js'
import { defaults } from './defaults.js'
import { opts } from './opts.js'

const mongodb = {
  name: 'mongodb',
  title: 'MongoDB',
  description: 'MongoDB database',
  features,
  connect,
  disconnect,
  query,
  defaults,
  opts,
  idName: '_id',
}

module.exports = {
  mongodb,
}
