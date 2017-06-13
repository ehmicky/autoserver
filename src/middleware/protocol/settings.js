'use strict';


const { transtype, map, assignObject } = require('../../utilities');


// Fill in `input.settings`, which are settings which apply to the whole
// operation. The list is predefined by the API engine.
// They can be defined:
//  - in headers, namespaced, e.g. 'X-ApiEngine-SETTINGS'
//  - in query string, using `settings.SETTINGS`
// Redundant protocol-specific headers might exist for some settings.
// E.g. settings 'noOutput' can be defined using
// HTTP header Prefer: return=minimal
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

const getSettings = function ({ input: { headers } }) {
  // Filters headers with only the headers whose name starts with X-NAMESPACE-
  const settings = Object.entries(headers)
    .filter(([name]) => SETTINGS_NAME_REGEXP.test(name))
    .map(([name, value]) => {
      const shortName = name.replace(SETTINGS_NAME_REGEXP, '');
      return { [shortName]: value };
    })
    .reduce(assignObject, {});

  const transtypedSettings = map(settings, value => transtype(value));

  return transtypedSettings;
};

const SETTINGS_NAME_REGEXP = /x-apiengine-/;


module.exports = {
  parseSettings,
};
