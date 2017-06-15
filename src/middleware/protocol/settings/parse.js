'use strict';


const { camelize } = require('underscore.string');

const { transtype, mapValues, assignObject } = require('../../../utilities');


// Retrieves settings
const getSettings = function ({ input }) {
  const querySettings = getQuerySettings({ input });
  const headersSettings = getHeadersSettings({ input });
  const settings = Object.assign({}, querySettings, headersSettings);

  const transtypedSettings = mapValues(settings, value => transtype(value));

  return transtypedSettings;
};

// Retrieves ?settings.mySettings query variables
const getQuerySettings = function ({ input: { queryVars: { settings } } }) {
  return settings;
};

// Filters headers with only the headers whose name starts
// with X-Api-Engine-My-Settings
const getHeadersSettings = function ({ input: { headers } }) {
  return Object.entries(headers)
    .filter(([name]) => SETTINGS_NAME_REGEXP.test(name))
    .map(([name, value]) => {
      const shortName = name.replace(SETTINGS_NAME_REGEXP, '');
      const key = camelize(shortName, true);
      return { [key]: value };
    })
    .reduce(assignObject, {});
};

const SETTINGS_NAME_REGEXP = /x-api-engine-/i;


module.exports = {
  getSettings,
};
