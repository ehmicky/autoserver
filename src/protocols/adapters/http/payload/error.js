import { format as formatBytes } from 'bytes'

import { throwPb } from '../../../../errors/props.js'

// `raw-body` throws some errors that we want to convert to the correct error
// reason
export const getRawBodyHandler = (error, { maxpayload }) => {
  // Indicates a bug in `raw-body` library
  if (!(error instanceof Error)) {
    throw error
  }

  const errorHandler = ERROR_HANDLERS[error.type]

  // Since we tried to cover all error types from `raw-body` library,
  // this indicates a bug in either our code or the library
  if (errorHandler === undefined) {
    throw error
  }

  const props = errorHandler({ error, maxpayload })
  throwPb({ ...props, innererror: error })
}

const entityTooLargeHandler = ({ error: { length }, maxpayload }) => {
  const message = `The request payload must not be larger than ${formatBytes(
    maxpayload,
  )}`

  return {
    reason: 'PAYLOAD_LIMIT',
    message,
    // `extra.value` might be `undefined`
    extra: { value: length, limit: maxpayload },
  }
}

const requestSizeHandler = ({ error: { expected, received } }) => {
  const message = `The HTTP request header 'Content-Length' does not match the request payload length. It should be ${expected} instead of ${received}.`

  return {
    reason: 'VALIDATION',
    message,
    extra: {
      kind: 'protocol',
      path: 'headers.Content-Length',
      value: received,
      suggestions: [expected],
    },
  }
}

const requestAbortedHandler = () => {
  const message =
    'The HTTP request was aborted by the client while the server was reading its payload'

  return { reason: 'ABORTED', message }
}

const ERROR_HANDLERS = {
  'entity.too.large': entityTooLargeHandler,
  'request.size.invalid': requestSizeHandler,
  'request.aborted': requestAbortedHandler,
}
