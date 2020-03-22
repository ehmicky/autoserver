import { addGenErrorHandler } from '../../errors/handler.js'
import { getLog } from '../../log/get.js'
import { DEFAULT_LOGGER } from '../../log/constants.js'

const { provider: defaultProvider } = DEFAULT_LOGGER

// Normalize `log`
export const normalizeLog = function ({ config: { log } }) {
  const logA = Array.isArray(log) ? log : [log]
  const logC = logA.map((logB) => addDefaultProviderName({ log: logB }))
  const logD = addDefaultProvider({ log: logC })

  const logE = logD.map(normalizeProvider)

  return { log: logE }
}

const addDefaultProviderName = function ({ log, log: { provider } }) {
  if (provider !== undefined) {
    return log
  }

  return { ...log, provider: defaultProvider }
}

// Default log provider is always available, but can be turned `silent` with
// `log.level`
const addDefaultProvider = function ({ log }) {
  const hasConsole = log.some(({ provider }) => provider === defaultProvider)

  if (hasConsole) {
    return log
  }

  return [...log, { provider: defaultProvider }]
}

const normalizeProvider = function (log) {
  const { provider, opts = {} } = log
  const { getOpts } = eGetLog(provider)

  if (getOpts === undefined) {
    return log
  }

  const optsA = getOpts({ opts })
  const optsB = { ...opts, ...optsA }
  return { ...log, opts: optsB }
}

// This validates the log provider exists
const eGetLog = addGenErrorHandler(getLog, { reason: 'CONFIG_VALIDATION' })
