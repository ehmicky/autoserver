import { pid } from 'process'

import moize from 'moize'

import { getHostInfo } from './host.js'
import { getProcessInfo } from './process.js'
import { getVersionsInfo } from './versions.js'

// Retrieve process-specific and host-specific information
const mGetServerinfo = function ({ config: { name: processName } = {} }) {
  const host = getHostInfo()
  const versions = getVersionsInfo()
  const processInfo = getProcessInfo({ host, processName })

  return { host, versions, process: processInfo }
}

// Speed up memoization because serializing `config` is slow
export const getServerinfo = moize(mGetServerinfo, {
  transformArgs: () => pid,
  maxSize: 1e3,
})
