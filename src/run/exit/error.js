'use strict'

const { addErrorHandler } = require('../../errors/handler.js')
const { createPb } = require('../../errors/props.js')
const { normalizeError } = require('../../errors/main.js')
const { logEvent } = require('../../log/main.js')

// Shutdown failures events
const addExitHandler = function(func) {
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

module.exports = {
  addExitHandler,
}
