'use strict'

const { wrapAdapters } = require('../adapters/wrap.js')

const { LOG_ADAPTERS } = require('./adapters/main.js')

const members = ['name', 'title', 'report', 'reportPerf', 'getOpts']

const logAdapters = wrapAdapters({
  adapters: LOG_ADAPTERS,
  members,
  reason: 'LOG',
})

module.exports = {
  logAdapters,
}
