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
  const mimes = [contentTypeMime, ...acceptMimes];

  const format = mimes
    .filter(mime => mime !== undefined)
    .map(mime => findFormat({ type: 'payload', mime }))
    .find(({ name: formatName } = {}) => formatName);
  if (format !== undefined) { return format.name; }

  validateMimesCharset({ choices: acceptMimes, name: 'format' });

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
  const charsets = [contentTypeCharset, ...acceptCharsets];

  const charset = charsets.find(encodingExists);
  if (charset !== undefined) { return charset; }

  validateMimesCharset({ choices: acceptCharsets, name: 'charset' });
};

// Parse HTTP header `Accept-Charset`
const getAcceptCharsets = function ({ specific: { req } }) {
  const negotiator = new Negotiator(req);
  const acceptCharsets = negotiator.charsets()
    .filter(charset => charset !== '*');
  return acceptCharsets;
};

// Parse HTTP header `Content-Type`
const getContentType = function ({ specific: { req: { headers } } }) {
  const contentType = headers['content-type'];
  if (!contentType) { return {}; }

  return parseContentType(contentType);
};

const validateMimesCharset = function ({ choices, name }) {
  // No format|charset was found, but none was explicitely asked for
  // Since `Content-Type` header can target any format|charset,
  // it is not checked here
  if (choices.length === 0) { return; }

  const invalidChoices = getWordsList(choices, { op: 'and', quotes: true });
  const message = `Unsupported response ${pluralize(name, choices.length)}: ${invalidChoices}`;
  throwError(message, { reason: 'RESPONSE_FORMAT' });
};

module.exports = {
  getFormat,
  getCharset,
};
