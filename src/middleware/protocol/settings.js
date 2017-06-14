'use strict';


const { transtype, map, assignObject } = require('../../utilities');


// Fill in `input.settings`, which are settings which apply to the whole
// operation. The list is predefined by the API engine.
// They can be defined:
//  - in headers, namespaced, e.g. 'X-Api-Engine-SETTINGS'
//  - in query string, using `settings.SETTINGS`
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

// Retrieves ?settings.SETTINGS query variables
const getQuerySettings = function ({ input: { queryVars: { settings } } }) {
  return settings;
};

// Filters headers with only the headers whose name starts
// with X-Api-Engine-
const getHeadersSettings = function ({ input: { headers } }) {
  return Object.entries(headers)
    .filter(([name]) => SETTINGS_NAME_REGEXP.test(name))
    .map(([name, value]) => {
      const shortName = name.replace(SETTINGS_NAME_REGEXP, '');
      return { [shortName]: value };
    })
    .reduce(assignObject, {});
};

const SETTINGS_NAME_REGEXP = /x-api-engine-/;


module.exports = {
  parseSettings,
};
