'use strict';

const { Negotiator } = require('negotiator');

const { compressAdapters } = require('../../../../compress');

// Use similar logic as `args.format`, but for `args.compressResponse`
// Uses HTTP header `Accept-Encoding`
const getCompressResponse = function ({ specific: { req } }) {
  const negotiator = new Negotiator(req);
  const compressResponse = negotiator.encodings()
    .find(compress => compressAdapters[compress] !== undefined);
  return compressResponse;
};

// Use similar logic as `args.format`, but for `args.compressRequest`
// Uses HTTP header `Content-Encoding`
const getCompressRequest = function ({ specific: { req: { headers } } }) {
  return headers['content-encoding'];
};

module.exports = {
  getCompressResponse,
  getCompressRequest,
};
