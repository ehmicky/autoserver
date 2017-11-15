'use strict';

const { parsePreferHeader } = require('./headers');
const { getFormat, getCharset } = require('./format_charset');

// Using `Prefer: return=minimal` request header results in `args.silent` true.
const silent = function ({ specific: { req: { headers: requestheaders } } }) {
  const preferHeader = parsePreferHeader({ requestheaders });
  const hasMinimalPreference = preferHeader.return === 'minimal';

  if (hasMinimalPreference) { return true; }
};

// HTTP-specific ways to set arguments
const args = {
  silent,
  format: getFormat,
  charset: getCharset,
};

module.exports = {
  args,
};
