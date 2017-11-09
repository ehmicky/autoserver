'use strict';

const { parsePreferHeader } = require('./headers');

// Using `Prefer: return=minimal` request header results in `args.silent` true.
const silent = function ({ requestheaders }) {
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
