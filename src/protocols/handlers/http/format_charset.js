'use strict';

const { parse: parseContentType } = require('content-type');
const { Negotiator } = require('negotiator');
const { encodingExists } = require('iconv-lite');
const pluralize = require('pluralize');

const { getWordsList } = require('../../../utilities');
const { throwError } = require('../../../error');
const { findFormat } = require('../../../formats');

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
  const { parameters: { charset: contentTypeCharset } = {} } = getContentType({
    specific,
  });
  const acceptCharsets = getAcceptCharsets({ specific });
  const charsets = [contentTypeCharset, ...acceptCharsets]
    .filter(charset => charset !== undefined);

  const charsetA = charsets.find(encodingExists);
  if (charsetA !== undefined) { return charsetA; }

  validateCharset({ acceptCharsets });
};

// Parse HTTP header `Accept-Charset`
const getAcceptCharsets = function ({ specific: { req } }) {
  const negotiator = new Negotiator(req);
  const acceptCharsets = negotiator.charsets()
    .filter(charset => charset !== '*');
  return acceptCharsets;
};

const validateCharset = function ({ acceptCharsets }) {
  // No charset was found, but none was explicitely asked for
  // Since `Content-Type` header can target any charset, it is not checked here
  if (acceptCharsets.length === 0) { return; }

  const invalidChoices = getWordsList(
    acceptCharsets,
    { op: 'and', quotes: true },
  );
  const message = `Unsupported response ${pluralize('charset', acceptCharsets.length)}: ${invalidChoices}`;
  throwError(message, { reason: 'RESPONSE_FORMAT' });
};

// Parse HTTP header `Content-Type`
const getContentType = function ({ specific: { req: { headers } } }) {
  const contentType = headers['content-type'];
  if (!contentType) { return {}; }

  return parseContentType(contentType);
};

module.exports = {
  getFormat,
  getCharset,
};
