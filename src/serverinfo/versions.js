const { version: nodeVersion } = require('process')

const readPkgUp = require('read-pkg-up')

// Caches it.
// TODO: use async instead
const {
  pkg: { version: autoserverVersion },
} = readPkgUp.sync()

// Retrieve environment-specific versions
const getVersionsInfo = function() {
  const autoserver = `v${autoserverVersion}`

  return { node: nodeVersion, autoserver }
}

module.exports = {
  getVersionsInfo,
}
