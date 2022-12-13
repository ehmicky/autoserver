import { getErrorMessage } from './error_message.js'
import { getPrefix } from './prefix.js'
import { getRequestMessage } from './request_message.js'

// Build a standardized event message:
// `[EVENT] [LEVEL] [HOSTID] [PROCESSNAME] [PROCESSID] [TIMESTAMP] [PHASE]
// MESSAGE - SUBMESSAGE
//   STACK_TRACE
// `PHASE` is requestid if phase is `request`
export const getConsoleMessage = ({ log }) =>
  parts.map((getPart) => getPart({ log })).join(' ')

const getMessage = ({ log, log: { event, phase, error, message = '' } }) => {
  if (event === 'failure') {
    return getErrorMessage({ error, message })
  }

  if (event === 'call' && phase === 'request') {
    return getRequestMessage(log)
  }

  return message
}

// Adds how long startup, shutdown or request took
const getDuration = ({ log: { duration } }) => {
  if (duration === undefined) {
    return ' '.repeat(DURATION_LENGTH)
  }

  const durationText = `${duration}ms`.padEnd(DURATION_LENGTH - 2)
  return `[${durationText}]`
}

const DURATION_LENGTH = 8

const parts = [getPrefix, getDuration, getMessage]
