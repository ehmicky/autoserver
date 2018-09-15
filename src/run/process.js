'use strict'

const process = require('process')
const { inspect } = require('util')

const { logEvent } = require('../log')
const { createPb } = require('../errors')

// Error handling for all failures that are process-related
// If a single process might start two instances of the server, each instance
// will collect the warnings of all the instances.
// Note that process events fired that do not belong to autoserver might be
// caught as well.
const processErrorHandler = function({ config }) {
  process.on('unhandledRejection', unhandledHandler.bind(null, config))
  process.on('rejectionHandled', rejectionHandledHandler.bind(null, config))
  process.on('warning', warningHandler.bind(null, config))
}

const unhandledHandler = async function(config, value) {
  const { message, innererror } = getUnhandledProps(value)

  await emitProcessEvent({ message, innererror, config })
}

const getUnhandledProps = function(value) {
  if (value instanceof Error) {
    return { message: UNHANDLED_MESSAGE, innererror: value }
  }

  return { message: `${UNHANDLED_MESSAGE} with value: ${value}` }
}

const UNHANDLED_MESSAGE = 'A promise was rejected and not handled right away'

const rejectionHandledHandler = async function(config, promise) {
  const message = `A promise was rejected but handled too late: ${inspect(
    promise,
  )}`

  await emitProcessEvent({ message, config })
}

const warningHandler = async function(config, error) {
  const { message, code, detail } = error
  const nextLine = [code, detail]
    .filter(string => string !== undefined)
    .join(':')
  const messageA = `${message}\n${nextLine}`

  await emitProcessEvent({ message: messageA, innererror: error, config })
}

// Report process problems as events with event 'failure'
const emitProcessEvent = async function({ message, innererror, config }) {
  const error = createPb(message, { reason: 'ENGINE', innererror })

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
