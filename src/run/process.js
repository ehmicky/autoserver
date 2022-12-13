import logProcessErrors from 'log-process-errors'

import { createPb } from '../errors/props.js'
import { logEvent } from '../log/main.js'

// Error handling for all failures that are process-related
// If a single process might start two instances of the server, each instance
// will collect the warnings of all the instances.
// Note that process events fired that do not belong to autoserver might be
// caught as well.
export const processErrorHandler = ({ config }) => {
  const stopProcessErrors = logProcessErrors({
    exit: false,
    onError: emitProcessEvent.bind(undefined, { config }),
  })
  return { stopProcessErrors }
}

// Report process problems as events with event 'failure'
const emitProcessEvent = async ({ config }, { stack }, event) => {
  const error = createPb(stack, { reason: 'ENGINE' })
  const level = event === 'warning' ? 'warn' : 'error'

  await logEvent({
    event: 'failure',
    phase: 'process',
    level,
    params: { error },
    config,
  })
}
