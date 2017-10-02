'use strict';

const { throwError } = require('../../../error');

// Validate that user passed a correct `args.data`
const validateData = function ({
  data,
  commandPath,
  top: { command: { type: commandType } },
}) {
  if (!isObject(data)) {
    const message = `'data' argument at '${commandPath.join('.')}' should be an object or an array of objects, instead of: ${JSON.stringify(data)}`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  if (requiredIdTypes.includes(commandType) && data.id == null) {
    const message = `'data' argument at '${commandPath.join('.')}' contains some models without an 'id' attribute`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  if (forbiddenIdTypes.includes(commandType) && data.id != null) {
    const message = `Cannot use 'id' '${data.id}': 'patch' commands cannot specify 'id' attributes in 'data' argument, because ids cannot be changed. Use 'filter' argument instead.`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }
};

const requiredIdTypes = ['replace'];
const forbiddenIdTypes = ['patch'];

const isModelType = function (val) {
  if (isObject(val)) { return true; }

  return Array.isArray(val) && val.every(isObject);
};

const isObject = function (obj) {
  return obj && obj.constructor === Object;
};

module.exports = {
  validateData,
  isModelType,
  isObject,
};
