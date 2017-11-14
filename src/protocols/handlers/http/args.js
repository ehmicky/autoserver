'use strict';

const { parse: parseContentType } = require('content-type');

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
  const { type: contentType } = getContentType({ specific });

  const { name } = findFormat({ type: 'payload', mime: contentType });
  return name;
};

const getContentType = function ({ specific: { req: { headers } } }) {
  const contentType = headers['content-type'];
  if (!contentType) { return; }

  return parseContentType(contentType);
};

// Use similar logic as `args.format`, but for `args.charset`
const charset = function ({ specific }) {
  const { parameters: { charset: name } } = getContentType({ specific });
  return name;
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
