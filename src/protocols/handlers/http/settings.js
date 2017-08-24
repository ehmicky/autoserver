'use strict';

const { mapValues, omitBy } = require('../../../utilities');

const { parsePreferHeader } = require('./headers');

// HTTP-specific ways to set settings
const getSettings = function (mInput) {
  const settings = mapValues(parsers, parser => parser(mInput));
  return omitBy(settings, value => value === undefined);
};

// Using `Prefer: return=minimal` request header -> settings.silent
const silent = function ({ headers }) {
  const preferHeader = parsePreferHeader({ headers });
  const hasMinimalPreference = preferHeader.return === 'minimal';

  if (hasMinimalPreference) {
    return true;
  }
};

const parsers = {
  silent,
};

module.exports = {
  getSettings,
};
