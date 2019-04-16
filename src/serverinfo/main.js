import { pid } from 'process'

import moize from 'moize'

import { getHostInfo } from './host.js'
import { getVersionsInfo } from './versions.js'
import { getProcessInfo } from './process.js'

// Retrieve process-specific and host-specific information
const mGetServerinfo = function({ config: { name: processName } = {} }) {
  const host = getHostInfo()
  const versions = getVersionsInfo()
  const processInfo = getProcessInfo({ host, processName })

  return { host, versions, process: processInfo }
}

// Speed up memoization because serializing `config` is slow
const getServerinfo = moize(mGetServerinfo, { transformArgs: () => pid })

module.exports = {
  getServerinfo,
}
