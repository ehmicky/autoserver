import { reduceParams } from '../functions/params/reduce.js'
import { getParams } from '../functions/params/values.js'

// Get log-specific config parameters
export const getLogParams = ({
  params,
  config,
  mInput = { config },
  event,
  phase,
  level,
  message,
}) => {
  const levelA = getLevel({ level, event })

  const paramsA = { ...params, event, phase, level: levelA, message }
  const paramsB = getParams(mInput, { params: paramsA })
  const log = reduceParams({ params: paramsB })

  // Used with `runConfigFunc()` by log providers
  const configFuncInput = { params: { ...paramsA, log }, mInput }

  return { log, configFuncInput }
}

// Level defaults to `error` for event `failure`, and to `log` for other events
const getLevel = ({ level, event }) => {
  if (level) {
    return level
  }

  if (event === 'failure') {
    return 'error'
  }

  return 'log'
}
