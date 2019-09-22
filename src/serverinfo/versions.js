import { version as nodeVersion } from 'process'

import readPkgUp from 'read-pkg-up'

// Caches it.
// TODO: use async instead
const {
  packageJson: { version: autoserverVersion },
} = readPkgUp.sync()

// Retrieve environment-specific versions
export const getVersionsInfo = function() {
  const autoserver = `v${autoserverVersion}`

  return { node: nodeVersion, autoserver }
}
