/* jscpd:ignore-start */
import { connect } from './connect.js'
import { defaults } from './defaults.js'
import { disconnect } from './disconnect.js'
import { features } from './features.js'
import { opts } from './opts.js'
import { query } from './query/main.js'
/* jscpd:ignore-end */

export const mongodb = {
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
