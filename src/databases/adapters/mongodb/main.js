const { features } = require('./features')
const { connect } = require('./connect')
const { disconnect } = require('./disconnect')
const { query } = require('./query/main.js')
const { defaults } = require('./defaults')
const { opts } = require('./opts')

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
