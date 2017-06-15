'use strict';


const {
  HTTP: { headers: { parsePrefer } },
} = require('../../../../../parsing');
const { mapValues, omitBy } = require('../../../../../utilities');


// HTTP-specific ways to set settings
const getSettings = function ({ input }) {
  const settings = mapValues(parsers, parser => parser({ input }));
  return omitBy(settings, value => value === undefined);
};

// Using `Prefer: return=minimal` request header -> settings.noOutput
const noOutput = function ({ input: { headers } }) {
  const preferHeader = parsePrefer({ headers });
  const hasMinimalPreference = preferHeader.return === 'minimal';
  if (hasMinimalPreference) {
    return true;
  }
};

const parsers = {
  noOutput,
};


module.exports = {
  HTTP: {
    getSettings,
  },
};
