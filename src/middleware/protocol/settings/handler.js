'use strict';

const { throwError } = require('../../../error');
const { addJsl } = require('../../../jsl');
const { addLogInfo } = require('../../../logging');

const { getSettings } = require('./parse');
const { validateSettings } = require('./validate');

// Fill in `input.settings`, which are settings which apply to the whole
// operation. The list is predefined by the API engine.
// Redundant protocol-specific headers might exist for some settings.
// Values are automatically transtyped.
// Are set to JSL param $SETTINGS
const parseSettings = async function (nextFunc, input) {
  const settings = getMergedSettings({ input });
  const settingsA = validateSettings({ settings });

  const inputA = addJsl(input, { $SETTINGS: settingsA });
  const inputB = addLogInfo(inputA, { settings: settingsA });
  const inputC = { ...inputB, settings: settingsA };

  const response = await nextFunc(inputC);
  return response;
};

const getMergedSettings = function ({ input }) {
  const genericSettings = getSettings({ input });
  const specificSettings = getSpecificSettings({ input });
  return { ...genericSettings, ...specificSettings };
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
