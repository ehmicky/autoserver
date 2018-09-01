'use strict'

const process = require('process')
const { inspect } = require('util')

const { logEvent } = require('../log')
const { createError } = require('../errors')

// Error handling for all failures that are process-related
// If a single process might start two instances of the server, each instance
// will collect the warnings of all the instances.
// Note that process events fired that do not belong to autoserver might be
// caught as well.
const processErrorHandler = function ({ config }) {
  setupUnhandledRejection({ config })
  setupRejectionHandled({ config })
  setupWarning({ config })
}

const setupUnhandledRejection = function ({ config }) {
  process.on('unhandledRejection', async value => {
    const { message, innererror } = getUnhandledProps(value)
    await emitProcessEvent({ message, innererror, config })
  })
}

const getUnhandledProps = function (value) {
  if (value instanceof Error) {
    return { message: UNHANDLED_MESSAGE, innererror: value }
  }

  return { message: `${UNHANDLED_MESSAGE} with value: ${value}` }
}

const UNHANDLED_MESSAGE = 'A promise was rejected and not handled right away'

const setupRejectionHandled = function ({ config }) {
  process.on('rejectionHandled', async promise => {
    const message = `A promise was rejected but handled too late: ${inspect(promise)}`
    await emitProcessEvent({ message, config })
  })
}

const setupWarning = function ({ config }) {
  process.on('warning', async error => {
    const { message, code, detail } = error
    const messageA = `${message}\n${code}: ${detail}`
    await emitProcessEvent({ message: messageA, innererror: error, config })
  })
}

// Report process problems as events with event 'failure'
const emitProcessEvent = async function ({ message, innererror, config }) {
  const error = createError(message, { reason: 'ENGINE', innererror })

  await logEvent({
    event: 'failure',
    phase: 'process',
    params: { error },
    config,
  })
}

module.exports = {
  processErrorHandler,
}
