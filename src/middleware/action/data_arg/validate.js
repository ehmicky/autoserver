'use strict';

const { throwError } = require('../../../error');

// Validate that user passed a correct `args.data`
const validateData = function ({
  datum,
  commandPath,
  top: { command: { type: commandType } },
  maxAttrValueSize,
}) {
  if (!isObject(datum)) {
    const message = `'data' argument at '${commandPath.join('.')}' should be an object or an array of objects, instead of: ${JSON.stringify(datum)}`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  if (REQUIRED_ID_TYPES.includes(commandType) && datum.id == null) {
    const message = `'data' argument at '${commandPath.join('.')}' is missing an 'id' attribute`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  if (FORBIDDEN_ID_TYPES.includes(commandType) && datum.id != null) {
    const message = `'data' argument at '${commandPath.join('.')}' must not have an 'id' attribute '${datum.id}'. 'patch' commands cannot specify 'id' attributes in 'data' argument, because ids cannot be changed. Use 'filter' argument instead.`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  Object.entries(datum).forEach(([attrName, value]) => validateDataValue({
    value,
    attrName,
    commandPath,
    maxAttrValueSize,
  }));
};

const REQUIRED_ID_TYPES = ['replace'];
const FORBIDDEN_ID_TYPES = ['patch'];

// Validate each attribute's value inside `args.data`
const validateDataValue = function ({
  value,
  attrName,
  commandPath,
  maxAttrValueSize,
}) {
  const isValueTooLong = typeof value === 'string' &&
    Buffer.byteLength(value) > maxAttrValueSize;

  if (isValueTooLong) {
    const path = [...commandPath.slice(1), attrName].join('.');
    const message = `'data' argument's '${path}' attribute's value must be shorter than ${maxAttrValueSize} bytes`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }
};

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
