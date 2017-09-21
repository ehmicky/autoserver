'use strict';

const { throwError } = require('../../error');

// Command-related validation middleware
// Check mInput, for the errors that should not happen,
// i.e. server-side (e.g. 500)
const commandValidation = function ({ args }) {
  validateCurrentData({ args });
};

// Validate that `args.currentData` reflects `args.newData`
const validateCurrentData = function ({ args: { newData, currentData } }) {
  if (!currentData) { return; }

  newData.forEach((datum, index) => validateCurrentDatum({
    newData: datum,
    currentData: currentData[index],
  }));
};

const validateCurrentDatum = function ({ newData, currentData }) {
  if (!currentData) { return; }

  const differentId = newData.id !== currentData.id;
  if (!differentId) { return; }

  const message = `'args.currentData' has invalid 'id' '${currentData.id}' instead of '${newData.id}'`;
  throwError(message, { reason: 'INPUT_SERVER_VALIDATION' });
};

module.exports = {
  commandValidation,
};
