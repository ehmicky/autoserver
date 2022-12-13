import underscoreString from 'underscore.string'

import { createError } from './main.js'
import { REASONS } from './reasons/main.js'

// Throw exception for a specific error reason
export const throwPb = ({ message, messageInput, ...opts } = {}) => {
  const error = createPb(message, { messageInput, ...opts })
  throw error
}

export const createPb = (message, { messageInput, ...opts } = {}) => {
  const messageA = getPropsMessage({ message, messageInput, ...opts })

  const error = createError(messageA, opts)
  return error
}

const getPropsMessage = ({ message, messageInput, ...opts }) => {
  const prefix = getPrefix({ messageInput, ...opts })
  const messageA = addPrefix({ message, prefix }) || MISSING_MESSAGE
  return messageA
}

// Each error reason can have its own message prefix and additional props
const getPrefix = ({ messageInput, reason, extra = {} }) => {
  const { getMessage } = getProps({ reason })

  if (getMessage === undefined) {
    return
  }

  const message = getMessage({ ...extra, ...messageInput })
  return message
}

const MISSING_MESSAGE = 'Missing error message'

const addPrefix = ({ message, prefix }) => {
  if (message === undefined) {
    return prefix
  }

  if (prefix === undefined) {
    return message
  }

  return `${prefix}: ${underscoreString.decapitalize(message)}`
}

// Get generic standard error properties, according to error reason
export const getProps = (error) => {
  const reason = getReason(error)
  const props = REASONS[reason]
  return props
}

// Get error reason
export const getReason = ({ reason = 'UNKNOWN' } = SUCCESS_REASON) => {
  if (REASONS[reason] === undefined) {
    return 'UNKNOWN'
  }

  return reason
}

const SUCCESS_REASON = { reason: 'SUCCESS' }
