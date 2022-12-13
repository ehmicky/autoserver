import { monitor } from '../../perf/helpers.js'

import { addExitHandler } from './error.js'
import { emitMessageEvent } from './message.js'

// Add event handling, message event and monitoring capabilities to the function
export const wrapCloseFunc = (func) => {
  const funcA = closeFunc.bind(undefined, func)

  const eFunc = addExitHandler(funcA)

  const mFunc = monitor(eFunc, getEventLabel, 'main')
  return mFunc
}

const closeFunc = async (func, opts) => {
  await emitMessageEvent({ ...opts, step: 'start' })

  await func(opts)

  await emitMessageEvent({ ...opts, step: 'end' })

  // Exit status
  return { [opts.adapter.name]: true }
}

const getEventLabel = ({ type, adapter: { name } }) => `${type}.${name}`
