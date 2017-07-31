'use strict';

const { throwError } = require('../../../error');

// Validate that `args.currentData` reflects `args.newData`
const validateCurrentData = function (input) {
  const { args: { currentData } } = input;

  if (!currentData) { return input; }

  return currentDataValidators.reduce(
    (inputA, validator) => validator(inputA),
    input,
  );
};

const validateDifferentTypes = function (input) {
  const { newData, currentData } = input;

  const differentTypes =
    (Array.isArray(newData) && !Array.isArray(currentData)) ||
    (!Array.isArray(newData) && Array.isArray(currentData)) ||
    (!newData && currentData);
  if (!differentTypes) { return input; }

  const message = `'args.currentData' is invalid: ${JSON.stringify(currentData)}`;
  throwError(message, { reason: 'INPUT_SERVER_VALIDATION' });
};

const validateCurrentDataValue = function (input) {
  const { args: { newData, currentData } } = input;

  const newDatas = Array.isArray(newData) ? newData : [newData];
  const currentDatas = Array.isArray(currentData) ? currentData : [currentData];

  return newDatas.reduce(
    (inputA, datum, index) => validateCurrentDatum({
      input,
      newData: datum,
      currentData: currentDatas[index],
    }),
    input,
  );
};

const validateCurrentDatum = function ({ input, newData, currentData }) {
  if (!currentData) { return input; }

  const differentId = newData.id !== currentData.id;
  if (!differentId) { return input; }

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
