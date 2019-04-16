import { hasBody } from 'type-is'
import getBody from 'raw-body'

import { addErrorHandler } from '../../../../errors/handler.js'
import { throwPb } from '../../../../errors/props.js'

import { getRawBodyHandler } from './error.js'

// Loads raw request payload
// Should handle:
//  - error handling
//  - if the protocol forces content-length to be specified, handle that
// Should not handle (as it is done in protocol-agnostic way):
//  - charset decoding
//  - compression/decompression
//  - content parsing. Return raw buffer instead
export const getPayload = function({
  specific,
  specific: { req },
  maxpayload,
}) {
  const length = getContentLength({ specific })

  return eGetRawBody({ req, length, maxpayload })
}

// Retrieves payload length
const getContentLength = function({
  specific: {
    req: { headers },
  },
}) {
  const contentLength = headers['content-length']

  if (contentLength !== undefined) {
    return contentLength
  }

  const message =
    "Must specify HTTP header 'Content-Length' when sending a request payload"
  throwPb({ reason: 'NO_CONTENT_LENGTH', message })
}

const getRawBody = function({ req, length, maxpayload }) {
  return getBody(req, { length, limit: maxpayload })
}

const eGetRawBody = addErrorHandler(getRawBody, getRawBodyHandler)

// Check if there is a request payload
export const hasPayload = function({ specific: { req } }) {
  return hasBody(req)
}
