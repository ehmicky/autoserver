'use strict'

const { Negotiator } = require('negotiator')

const { findAlgo } = require('../../../../compress')

// Use similar logic as `args.format`, but for `args.compressResponse`
// Uses HTTP header `Accept-Encoding`
const getCompressResponse = function ({ specific: { req } }) {
  const negotiator = new Negotiator(req)
  const algos = negotiator.encodings()
  const compressResponse = findAlgo(algos)
  return compressResponse
}

// Use similar logic as `args.format`, but for `args.compressRequest`
// Uses HTTP header `Content-Encoding`
const getCompressRequest = function ({ specific: { req: { headers } } }) {
  return headers['content-encoding']
}

module.exports = {
  getCompressResponse,
  getCompressRequest,
}
