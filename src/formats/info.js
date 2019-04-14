'use strict'

const { FORMAT_ADAPTERS } = require('./adapters/main.js')
const { getExtension } = require('./extensions')

// All possible extensions, for documentation
const getExtensions = function() {
  return FORMAT_ADAPTERS.map(formatAdapter =>
    getExtension(formatAdapter),
  ).filter(extension => extension !== undefined)
}

const EXTENSIONS = getExtensions()

module.exports = {
  EXTENSIONS,
}
