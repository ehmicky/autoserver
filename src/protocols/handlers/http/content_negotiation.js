'use strict';

const { parse: parseContentType } = require('content-type');
const { Negotiator } = require('negotiator');
const { encodingExists } = require('iconv-lite');

const { findFormat } = require('../../../formats');
const { compressHandlers, DEFAULT_COMPRESS } = require('../../../compress');

// Using `Content-Type` or `Accept-Encoding` results in `args.format`
// Note that since `args.format` is for both input and output, any of the
// two headers can be used. `Content-Type` has priority.
const getFormat = function ({ specific }) {
  const { type: contentTypeMime } = getContentType({ specific });
  const acceptMimes = getAcceptMimes({ specific });
  const mimes = [contentTypeMime, ...acceptMimes]
    .filter(mime => mime !== undefined);

  const format = mimes
    .map(mime => findFormat({ type: 'payload', mime }))
    .find(({ name: formatName } = {}) => formatName);
  if (format !== undefined) { return format.name; }

  // Request payload won't be parsed. Response payload will use default format.
  if (contentTypeMime !== undefined) { return 'raw'; }
};

// Parse HTTP header `Accept`
const getAcceptMimes = function ({ specific: { req } }) {
  const negotiator = new Negotiator(req);
  const acceptMimes = negotiator.mediaTypes()
    .filter(mime => mime !== '*/*');
  return acceptMimes;
};

// Use similar logic as `args.format`, but for `args.charset`
const getCharset = function ({ specific }) {
  const { parameters: { charset } = {} } = getContentType({ specific });

  const isValidCharset = charset !== undefined && encodingExists(charset);
  if (!isValidCharset) { return; }

  return charset;
};

// Parse HTTP header `Content-Type`
const getContentType = function ({ specific: { req: { headers } } }) {
  const contentType = headers['content-type'];
  if (!contentType) { return {}; }

  return parseContentType(contentType);
};

// Use similar logic as `args.format`, but for `args.compressResponse`
// Uses HTTP header `Accept-Encoding`
const getCompressResponse = function ({ specific: { req } }) {
  const negotiator = new Negotiator(req);
  const compressResponse = negotiator.encodings()
    .filter(compress => compress !== DEFAULT_COMPRESS.name)
    .find(compress => compressHandlers[compress] !== undefined);
  return compressResponse;
};

// Use similar logic as `args.format`, but for `args.compressRequest`
// Uses HTTP header `Content-Encoding`
const getCompressRequest = function ({ specific: { req: { headers } } }) {
  return headers['content-encoding'];
};

module.exports = {
  getFormat,
  getCharset,
  getCompressResponse,
  getCompressRequest,
};
