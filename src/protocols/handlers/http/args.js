'use strict';

const { mapValues, omitBy } = require('../../../utilities');

const { parsePreferHeader } = require('./headers');

// HTTP-specific ways to set arguments
const getArgs = function (mInput) {
  const args = mapValues(parsers, parser => parser(mInput));
  return omitBy(args, value => value === undefined);
};

// Using `Prefer: return=minimal` request header -> `args.silent`
const silent = function ({ headers }) {
  const preferHeader = parsePreferHeader({ headers });
  const hasMinimalPreference = preferHeader.return === 'minimal';

  if (hasMinimalPreference) { return true; }
};

const parsers = {
  silent,
};

module.exports = {
  getArgs,
};
