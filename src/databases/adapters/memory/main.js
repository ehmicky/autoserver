'use strict'

const { features } = require('./features')
const { disconnect } = require('./disconnect')
const { connect } = require('./connect')
const { query } = require('./query/main.js')
const { check } = require('./check')
const { defaults } = require('./defaults')
const { opts } = require('./opts')

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
