import { addErrorHandler } from '../../errors/handler.js'
import { createPb } from '../../errors/props.js'
import { normalizeError } from '../../errors/main.js'
import { logEvent } from '../../log/main.js'

// Shutdown failures events
export const addExitHandler = function(func) {
  return addErrorHandler(func, funcHandler)
}

const funcHandler = async function(
  error,
  { config, type, adapter: { title, name } },
) {
  const message = FAILURE_MESSAGES[type]
  const reason = REASONS[type]

  const innererror = normalizeError({ error })
  const errorA = createPb(message, {
    reason,
    extra: { adapter: name },
    innererror,
  })

  const eventMessage = `${title} - ${message}`

  await logEvent({
    event: 'failure',
    phase: 'shutdown',
    message: eventMessage,
    params: { error: errorA },
    config,
  })

  // Exit status
  return { [name]: false }
}

const FAILURE_MESSAGES = {
  protocols: 'Failed shutdown',
  databases: 'Failed disconnection',
}

const REASONS = {
  protocols: 'PROTOCOL',
  databases: 'DATABASE',
}
