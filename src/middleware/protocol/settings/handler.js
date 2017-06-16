'use strict';


const { makeImmutable } = require('../../../utilities');
const { EngineError } = require('../../../error');
const { getSettings } = require('./parse');
const { validateSettings } = require('./validate');


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
const parseSettings = async function (input) {
  const { jsl, log, protocolHandler } = input;
  const perf = log.perf.start('protocol.parseSettings', 'middleware');

  const genericSettings = getSettings({ input });
  const specificSettings = getSpecificSettings({ input, protocolHandler });
  const settings = Object.assign({}, genericSettings, specificSettings);

  validateSettings({ settings });
  makeImmutable(settings);

  const newJsl = jsl.add({ $SETTINGS: settings });

  log.add({ settings });
  Object.assign(input, { settings, jsl: newJsl });

  perf.stop();
  const response = await this.next(input);
  return response;
};

const getSpecificSettings = function ({ input, protocolHandler }) {
  const specificSettings = protocolHandler.getSettings({ input });

  if (!specificSettings || specificSettings.constructor !== Object) {
    const message = `'specificSettings' must be an object, not '${specificSettings}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return specificSettings;
};


module.exports = {
  parseSettings,
};
