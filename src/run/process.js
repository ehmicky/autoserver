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
  process.on('multipleResolves', multipleResolvesHandler.bind(null, config))
  process.on('rejectionHandled', rejectionHandledHandler.bind(null, config))
  process.on('warning', warningHandler.bind(null, config))
}

const unhandledHandler = async function(config, value) {
  const { suffix, innererror } = getPromiseValue(value)
  const message = `A promise was rejected${suffix} and not handled right away`

  await emitProcessEvent({ message, innererror, config })
}

// eslint-disable-next-line max-params
const multipleResolvesHandler = async function(config, type, promise, value) {
  const { suffix, innererror } = getPromiseValue(value)
  const message = `A promise was ${type}d${suffix} after being already settled`

  await emitProcessEvent({ message, innererror, config })
}

const getPromiseValue = function(value) {
  if (value instanceof Error) {
    return { suffix: '', innererror: value }
  }

  return { suffix: ` with value '${value}'` }
}

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
