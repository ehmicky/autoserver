'use strict';


const {
  HTTP: { headers: { parsePrefer } },
} = require('../../../../../parsing');
const { assignObject } = require('../../../../../utilities');


// HTTP-specific ways to set settings
const getSettings = function ({ input }) {
  return Object.entries(parsers)
    .map(([name, parser]) => {
      const value = parser({ input });
      return [name, value];
    })
    .filter(([, value]) => value !== undefined)
    .reduce(assignObject, {});
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
