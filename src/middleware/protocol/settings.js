'use strict';


const { camelize } = require('underscore.string');

const { transtype, map, assignObject } = require('../../utilities');


// Fill in `input.settings`, which are settings which apply to the whole
// operation. The list is predefined by the API engine.
// They can be defined:
//  - in headers, namespaced, e.g. 'X-Api-Engine-My-Settings'
//  - in query string, using `settings.mySettings`
// Redundant protocol-specific headers might exist for some settings.
// E.g. settings 'noOutput' can be defined using
// HTTP header Prefer: return=minimal
// Values are automatically transtyped.
// Are set to JSL param $SETTINGS
const parseSettings = function () {
  return async function parseSettings(input) {
    const { jsl, log } = input;
    const perf = log.perf.start('protocol.parseSettings', 'middleware');

    const settings = getSettings({ input });

    const newJsl = jsl.add({ $SETTINGS: settings });

    log.add({ settings });
    Object.assign(input, { settings, jsl: newJsl });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

const getSettings = function ({ input }) {
  const querySettings = getQuerySettings({ input });
  const headersSettings = getHeadersSettings({ input });
  const settings = Object.assign({}, querySettings, headersSettings);

  const transtypedSettings = map(settings, value => transtype(value));

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

const SETTINGS_NAME_REGEXP = /x-api-engine-/;


module.exports = {
  parseSettings,
};
