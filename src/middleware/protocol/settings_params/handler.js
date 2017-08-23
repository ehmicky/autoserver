'use strict';

const { settings, params } = require('./types');
const { getValues } = require('./parse');
const { transformValues } = require('./transform');
const { validateValues } = require('./validate');
const { addValues } = require('./add');

// Fill in:
//  - `input.params`, which are custom application-specific information,
//     defined by the library user, not by the API engine.
//  - `input.settings`, which are settings which apply to the whole
//     operation. The list is predefined by the API engine.
//     Redundant protocol-specific headers might exist for some settings.
// Values are automatically transtyped.
// Are set to IDL function variables $PARAMS and $SETTINGS
const parseSettingsParams = function (input) {
  const inputA = addType({ input, type: settings });
  const inputB = addType({ input: inputA, type: params });

  return inputB;
};

const addType = function ({ input, type }) {
  const values = getValues({ input, type });
  const valuesA = transformValues({ values });
  const valuesB = validateValues({ values: valuesA, type });
  const inputA = addValues({ input, values: valuesB, type });
  return inputA;
};

module.exports = {
  parseSettingsParams,
};
