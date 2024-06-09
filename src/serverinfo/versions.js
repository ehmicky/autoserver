import { dirname } from 'node:path'
import { version as nodeVersion } from 'node:process'
import { fileURLToPath } from 'node:url'

import { readPackageUp } from 'read-package-up'

// Caches it.
const {
  packageJson: { version: autoserverVersion },
} = await readPackageUp({ cwd: dirname(fileURLToPath(import.meta.url)) })

// Retrieve environment-specific versions
export const getVersionsInfo = () => {
  const autoserver = `v${autoserverVersion}`

  return { node: nodeVersion, autoserver }
}
