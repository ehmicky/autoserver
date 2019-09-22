import filterObj from 'filter-obj'

import { getReason, getProps } from './props.js'
import { normalizeError } from './main.js'

// Gets normalized error information
export const getStandardError = function({ error, mInput }) {
  if (!error) {
    return
  }

  const errorA = normalizeError({ error })

  const errorB = fillError({ error: errorA, mInput })

  // Do not expose undefined values
  const errorC = filterObj(errorB, isDefined)
  return errorC
}

const fillError = function({
  error,
  mInput: { path: instance, status = 'SERVER_ERROR' } = {},
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

const isDefined = function(key, value) {
  return value !== undefined
}
