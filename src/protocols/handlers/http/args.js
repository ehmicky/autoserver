'use strict';

const { parsePreferHeader } = require('./headers');

// Using `Prefer: return=minimal` request header results in `args.silent` true.
// Same thing for using HTTP method HEAD
const silent = function ({ requestheaders, specific: { req: { method } } }) {
  const isHead = method === 'HEAD';
  if (isHead) { return true; }

  const preferHeader = parsePreferHeader({ requestheaders });
  const hasMinimalPreference = preferHeader.return === 'minimal';

  if (hasMinimalPreference) { return true; }
};

// HTTP-specific ways to set arguments
const args = {
  silent,
};

module.exports = {
  args,
};
