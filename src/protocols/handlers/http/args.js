'use strict';

const { mapValues, omitBy } = require('../../../utilities');

const { parsePreferHeader } = require('./headers');

// HTTP-specific ways to set arguments
const getArgs = function (mInput) {
  const args = mapValues(parsers, parser => parser(mInput));
  return omitBy(args, value => value === undefined);
};

// Using `Prefer: return=minimal` request header results in `args.silent` true.
// Same thing for using HTTP method HEAD
const silent = function ({ requestheaders, specific: { req: { method } } }) {
  const preferHeader = parsePreferHeader({ requestheaders });
  const hasMinimalPreference = preferHeader.return === 'minimal';

  const isHead = method === 'HEAD';

  if (hasMinimalPreference || isHead) { return true; }
};

const parsers = {
  silent,
};

module.exports = {
  getArgs,
};
