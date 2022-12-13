import getBody from 'raw-body'
import { hasBody } from 'type-is'

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
export const getPayload = ({ specific, specific: { req }, maxpayload }) => {
  const length = getContentLength({ specific })

  return eGetRawBody({ req, length, maxpayload })
}

// Retrieves payload length
const getContentLength = ({
  specific: {
    req: { headers },
  },
}) => {
  const contentLength = headers['content-length']

  if (contentLength !== undefined) {
    return contentLength
  }

  const message =
    "Must specify HTTP header 'Content-Length' when sending a request payload"
  throwPb({ reason: 'NO_CONTENT_LENGTH', message })
}

const getRawBody = ({ req, length, maxpayload }) =>
  getBody(req, { length, limit: maxpayload })

const eGetRawBody = addErrorHandler(getRawBody, getRawBodyHandler)

// Check if there is a request payload
export const hasPayload = ({ specific: { req } }) => hasBody(req)
