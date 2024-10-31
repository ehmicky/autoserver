import { addErrorHandler } from '../errors/handler.js'
import { normalizeError } from '../errors/main.js'
import { createPb } from '../errors/props.js'

import { DEFAULT_LOGGER, LEVELS } from './constants.js'
import { getLog } from './get.js'
import { getLogParams } from './params.js'

// Log some event, including printing to console
// `config.log` might be `undefined` if the error happened at startup time.
const eLogEvent = async ({
  config,
  config: { log: logConf = [DEFAULT_LOGGER] },
  ...rest
}) => {
  const { log, configFuncInput } = getLogParams({ config, ...rest })

  // Can fire several logAdapters at the same time
  const promises = logConf.map((logConfA) =>
    fireLogger({ logConf: logConfA, log, configFuncInput }),
  )
  // We make sure this function returns `undefined`
  await Promise.all(promises)
}

const fireLogger = ({
  logConf: { provider, opts = {}, level },
  log,
  log: { event },
  configFuncInput,
}) => {
  const noLog = !shouldLog({ level, log })

  if (noLog) {
    return
  }

  const reportFunc = getReportFunc({ event, provider })

  if (reportFunc === undefined) {
    return
  }

  return reportFunc({ log, opts, configFuncInput })
}

// Can filter verbosity with `config.log.level`
// This won't work for very early startup errors since config is not
// parsed yet.
const shouldLog = ({ level, log }) =>
  level !== 'silent' && LEVELS.indexOf(log.level) >= LEVELS.indexOf(level)

const getReportFunc = ({ event, provider }) => {
  // `perf` events are handled differently
  const funcName = event === 'perf' ? 'reportPerf' : 'report'
  const logProvider = getLog(provider)
  const reportFunc = logProvider[funcName]
  return reportFunc
}

const logEventHandler = (error, { config, event }) => {
  const errorA = normalizeError({ error })
  const errorB = createPb('An error occurred during logging', {
    reason: 'ENGINE',
    innererror: errorA,
  })
  const params = { error: errorB }

  // Give up if error handler fails
  // I.e. we do not need to `await` this
  silentLogEvent({ event: 'failure', phase: 'process', config, params })

  // Failure events are at the top of code stacks. They should not throw.
  if (event === 'failure') {
    return
  }

  throw errorB
}

export const logEvent = addErrorHandler(eLogEvent, logEventHandler)

// This means there is a bug in the logging code itself
export const safetyHandler = (error) => {
  const errorA = normalizeError({ error })
  const errorB = createPb('An error occurred during logging error handling', {
    reason: 'ENGINE',
    innererror: errorA,
  })
  // eslint-disable-next-line no-console, no-restricted-globals
  console.error(errorA.message, errorB)
}

const silentLogEvent = addErrorHandler(eLogEvent, safetyHandler)
