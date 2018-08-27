'use strict'

const { hasBody } = require('type-is')
const getBody = require('raw-body')

const { throwPb, addErrorHandler } = require('../../../../errors')

const { getRawBodyHandler } = require('./error')

// Loads raw request payload
// Should handle:
//  - error handling
//  - if the protocol forces content-length to be specified, handle that
// Should not handle (as it is done in protocol-agnostic way):
//  - charset decoding
//  - compression/decompression
//  - content parsing. Return raw buffer instead
const getPayload = function ({ specific, specific: { req }, maxpayload }) {
  const length = getContentLength({ specific })

  return eGetRawBody({ req, length, maxpayload })
}

// Retrieves payload length
const getContentLength = function ({ specific: { req: { headers } } }) {
  const contentLength = headers['content-length']
  if (contentLength !== undefined) { return contentLength }

  const message = 'Must specify HTTP header \'Content-Length\' when sending a request payload'
  throwPb({ reason: 'NO_CONTENT_LENGTH', message })
}

const getRawBody = function ({ req, length, maxpayload }) {
  return getBody(req, { length, limit: maxpayload })
}

const eGetRawBody = addErrorHandler(getRawBody, getRawBodyHandler)

// Check if there is a request payload
const hasPayload = function ({ specific: { req } }) {
  return hasBody(req)
}

module.exports = {
  getPayload,
  hasPayload,
}
