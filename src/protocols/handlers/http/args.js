'use strict';

const { parse: parseContentType } = require('content-type');
const { Negotiator } = require('negotiator');
const { encodingExists } = require('iconv-lite');

const { findFormat } = require('../../../formats');

const { parsePreferHeader } = require('./headers');

// Using `Prefer: return=minimal` request header results in `args.silent` true.
const silent = function ({ specific: { req: { headers: requestheaders } } }) {
  const preferHeader = parsePreferHeader({ requestheaders });
  const hasMinimalPreference = preferHeader.return === 'minimal';

  if (hasMinimalPreference) { return true; }
};

// Using `Content-Type` or `Accept-Encoding` results in `args.format`
// Note that since `args.format` is for both input and output, any of the
// two headers can be used. `Content-Type` has priority.
const format = function ({ specific }) {
  const { type: contentTypeMime } = getContentType({ specific });
  const acceptMimes = getAcceptMimes({ specific });
  const mimes = [contentTypeMime, ...acceptMimes];

  const formatB = mimes
    .filter(mime => mime !== undefined && mime !== '*/*')
    .map(mime => findFormat({ type: 'payload', mime }))
    .find(({ name: formatName } = {}) => formatName);
  if (formatB === undefined) { return; }

  return formatB.name;
};

// Use similar logic as `args.format`, but for `args.charset`
const charset = function ({ specific }) {
  const { parameters: { charset: contentTypeCharset } = {} } = getContentType({
    specific,
  });
  const acceptCharsets = getAcceptCharsets({ specific });
  const charsets = [contentTypeCharset, ...acceptCharsets];

  const name = charsets.find(encodingExists);
  return name;
};

// Parse HTTP header `Content-Type`
const getContentType = function ({ specific: { req: { headers } } }) {
  const contentType = headers['content-type'];
  if (!contentType) { return {}; }

  return parseContentType(contentType);
};

// Parse HTTP header `Accept`
const getAcceptMimes = function ({ specific: { req } }) {
  const negotiator = new Negotiator(req);
  const acceptMimes = negotiator.mediaTypes();
  return acceptMimes;
};

// Parse HTTP header `Accept`
const getAcceptCharsets = function ({ specific: { req } }) {
  const negotiator = new Negotiator(req);
  const acceptCharsets = negotiator.charsets();
  return acceptCharsets;
};

// HTTP-specific ways to set arguments
const args = {
  silent,
  format,
  charset,
};

module.exports = {
  args,
};
