import { dirname } from 'node:path'
import { version as nodeVersion } from 'node:process'
import { fileURLToPath } from 'node:url'

import { readPackageUpSync } from 'read-pkg-up'

// Caches it.
// TODO: use async instead
const {
  packageJson: { version: autoserverVersion },
} = readPackageUpSync({ cwd: dirname(fileURLToPath(import.meta.url)) })

// Retrieve environment-specific versions
export const getVersionsInfo = function () {
  const autoserver = `v${autoserverVersion}`

  return { node: nodeVersion, autoserver }
}
