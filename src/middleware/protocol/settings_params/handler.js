'use strict';

const { settings, params } = require('./types');
const { getValues } = require('./parse');
const { transformValues } = require('./transform');
const { validateValues } = require('./validate');

// Fill in:
//  - `mInput.params`, which are custom application-specific information,
//     defined by the library user, not by the API engine.
//  - `mInput.settings`, which are settings which apply to the whole
//     operation. The list is predefined by the API engine.
//     Redundant protocol-specific headers might exist for some settings.
// Values are automatically transtyped.
// Are set to IDL function variables $PARAMS and $SETTINGS
const parseSettings = function ({ mInput }) {
  return addType({ mInput, type: settings });
};

const parseParams = function ({ mInput }) {
  return addType({ mInput, type: params });
};

const addType = function ({ mInput, type, type: { genericName } }) {
  const values = getValues({ mInput, type });
  const valuesA = transformValues({ values });
  const valuesB = validateValues({ values: valuesA, type });

  return { [genericName]: valuesB };
};

module.exports = {
  parseSettings,
  parseParams,
};
