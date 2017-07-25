'use strict';

const { makeImmutable } = require('../../../utilities');
const { throwError } = require('../../../error');

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
const parseSettings = async function (nextFunc, input) {
  const { jsl, log } = input;

  const settings = getMergedSettings({ input });
  validateSettings({ settings });
  makeImmutable(settings);

  const nextInput = jsl.addToInput(input, { $SETTINGS: settings });
  log.add({ settings });
  Object.assign(nextInput, { settings });

  const response = await nextFunc(nextInput);
  return response;
};

const getMergedSettings = function ({ input }) {
  const genericSettings = getSettings({ input });
  const specificSettings = getSpecificSettings({ input });
  return Object.assign({}, genericSettings, specificSettings);
};

const getSpecificSettings = function ({ input, input: { protocolHandler } }) {
  const specificSettings = protocolHandler.getSettings({ input });

  if (!specificSettings || specificSettings.constructor !== Object) {
    const message = `'specificSettings' must be an object, not '${specificSettings}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return specificSettings;
};

module.exports = {
  parseSettings,
};
