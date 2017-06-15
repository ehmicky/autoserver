'use strict';


const { mapValues, omitBy } = require('../../../utilities');
const { parsePreferHeader } = require('./headers');


// HTTP-specific ways to set settings
const getSettings = function ({ input }) {
  const settings = mapValues(parsers, parser => parser({ input }));
  return omitBy(settings, value => value === undefined);
};

// Using `Prefer: return=minimal` request header -> settings.noOutput
const noOutput = function ({ input: { headers } }) {
  const preferHeader = parsePreferHeader({ headers });
  const hasMinimalPreference = preferHeader.return === 'minimal';
  if (hasMinimalPreference) {
    return true;
  }
};

const parsers = {
  noOutput,
};


module.exports = {
  getSettings,
};
