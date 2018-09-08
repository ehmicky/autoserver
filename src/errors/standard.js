'use strict'

const { omitBy } = require('../utils')

const { getReason, getProps } = require('./props')
const { normalizeError } = require('./main')

// Gets normalized error information
const getStandardError = function ({ error, mInput }) {
  if (!error) { return }

  const errorA = normalizeError({ error })

  const errorB = fillError({ error: errorA, mInput })

  // Do not expose undefined values
  const errorC = omitBy(errorB, val => val === undefined)

  return errorC
}

const fillError = function ({
  error,
  mInput: {
    path: instance,
    status = 'SERVER_ERROR',
  } = {},
}) {
  const type = getReason(error)
  const { title } = getProps(error)

  const {
    message: description,
    stack: outerStack,
    innererror: { stack: details = outerStack } = {},
    extra = {},
  } = error

  // Order matters, as this will be kept in final output
  return { type, title, description, status, instance, ...extra, details }
}

module.exports = {
  getStandardError,
}
