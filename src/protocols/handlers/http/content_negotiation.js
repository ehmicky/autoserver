'use strict';

const { parse: parseContentType } = require('content-type');
const { Negotiator } = require('negotiator');
const pluralize = require('pluralize');

const { getWordsList } = require('../../../utilities');
const { throwError } = require('../../../error');
const { findFormat } = require('../../../formats');
const { compressHandlers } = require('../../../compress');

// Using `Content-Type` or `Accept` results in `args.format`
// Note that since `args.format` is for both input and output, any of the
// two headers can be used. `Content-Type` has priority.
const getFormat = function ({ specific }) {
  return getContentTypeFormat({ specific }) || getAcceptFormat({ specific });
};

// Using `Content-Type` header
const getContentTypeFormat = function ({ specific }) {
  const { type: mime } = getContentType({ specific });
  if (mime === undefined) { return; }

  // Request payload won't be parsed. Response payload will use default format.
  const format = findFormat({ type: 'payload', mime });
  if (format === undefined) { return 'raw'; }

  return format.name;
};

// Using `Accept` header
const getAcceptFormat = function ({ specific: { req } }) {
  const negotiator = new Negotiator(req);
  const mimes = negotiator.mediaTypes();
  if (mimes.length === 0) { return; }

  const format = mimes
    .map(mime => findFormat({ type: 'payload', mime }))
    .find(formatA => formatA !== undefined);
  if (format !== undefined) { return format.name; }

  const formats = getWordsList(mimes, { op: 'and', quotes: true });
  const message = `Unsupported response ${pluralize('format', mimes.length)}: ${formats}`;
  throwError(message, { reason: 'RESPONSE_FORMAT' });
};

// Use similar logic as `args.format`, but for `args.charset`
const getCharset = function ({ specific }) {
  const { parameters: { charset } = {} } = getContentType({ specific });
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
