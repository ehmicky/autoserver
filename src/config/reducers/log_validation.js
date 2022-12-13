import { LOG_OPTS } from '../../log/info.js'

import { validateAdaptersOpts } from './adapter_opts.js'

// Validates `log.LOG.*`
export const validateLogs = ({ config: { log } }) => {
  const optsA = log.map(({ provider, opts = {} }) => ({ [provider]: opts }))
  const optsB = Object.assign({}, ...optsA)
  validateAdaptersOpts({ opts: optsB, adaptersOpts: LOG_OPTS, key: 'log' })
}
