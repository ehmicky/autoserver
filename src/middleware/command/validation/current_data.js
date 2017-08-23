'use strict';

const { throwError } = require('../../../error');

// Validate that `args.currentData` reflects `args.newData`
const validateCurrentData = function ({ args, args: { currentData } }) {
  if (!currentData) { return; }

  return currentDataValidators.forEach(validator => validator({ args }));
};

const validateDifferentTypes = function ({ args: { newData, currentData } }) {
  const differentTypes =
    (Array.isArray(newData) && !Array.isArray(currentData)) ||
    (!Array.isArray(newData) && Array.isArray(currentData)) ||
    (!newData && currentData);
  if (!differentTypes) { return; }

  const message = `'args.currentData' is invalid: ${JSON.stringify(currentData)}`;
  throwError(message, { reason: 'INPUT_SERVER_VALIDATION' });
};

const validateCurrentDataValue = function ({ args: { newData, currentData } }) {
  const newDatas = Array.isArray(newData) ? newData : [newData];
  const currentDatas = Array.isArray(currentData) ? currentData : [currentData];

  return newDatas.forEach((datum, index) => validateCurrentDatum({
    newData: datum,
    currentData: currentDatas[index],
  }));
};

const validateCurrentDatum = function ({ newData, currentData }) {
  if (!currentData) { return; }

  const differentId = newData.id !== currentData.id;
  if (!differentId) { return; }

  const message = `'args.currentData' has invalid 'id' '${currentData.id}' instead of '${newData.id}'`;
  throwError(message, { reason: 'INPUT_SERVER_VALIDATION' });
};

const currentDataValidators = [
  validateDifferentTypes,
  validateCurrentDataValue,
];

module.exports = {
  validateCurrentData,
};
