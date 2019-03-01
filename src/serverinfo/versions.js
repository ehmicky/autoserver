'use strict'

const { version: nodeVersion } = require('process')

// eslint-disable-next-line node/no-missing-require, import/no-unresolved
const { version: autoserverVersion } = require('../../../package.json')

// Retrieve environment-specific versions
const getVersionsInfo = function() {
  const autoserver = `v${autoserverVersion}`

  return { node: nodeVersion, autoserver }
}

module.exports = {
  getVersionsInfo,
}
