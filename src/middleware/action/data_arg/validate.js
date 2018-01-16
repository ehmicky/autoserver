'use strict';

const { Buffer: { byteLength } } = require('buffer');

const { throwError } = require('../../../errors');
const { isPatchOp } = require('../../../patch');

// Validate that user passed a correct `args.data`
const validateData = function ({
  datum,
  commandpath,
  top: { command },
  maxAttrValueSize,
}) {
  const commandpathA = commandpath.join('.');

  validateType({ datum, commandpath: commandpathA });

  validateRequiredId({ datum, commandpath: commandpathA, command });

  validateForbiddenId({ datum, commandpath: commandpathA, command });

  Object.entries(datum).forEach(([attrName, value]) => validateDataValue({
    value,
    attrName,
    commandpath: commandpathA,
    maxAttrValueSize,
  }));
};

const validateType = function ({ datum, commandpath }) {
  if (isModelType(datum)) { return; }

  const message = `'data' argument at '${commandpath}' should be an object or an array of objects, instead of: ${JSON.stringify(datum)}`;
  throwError(message, { reason: 'VALIDATION' });
};

const validateRequiredId = function ({ datum, commandpath, command }) {
  if (!REQUIRED_ID_TYPES.includes(command.type) || datum.id != null) { return; }

  const message = `'data' argument at '${commandpath}' is missing an 'id' attribute`;
  throwError(message, { reason: 'VALIDATION' });
};

const REQUIRED_ID_TYPES = ['upsert'];

const validateForbiddenId = function ({ datum, commandpath, command }) {
  const forbidsId = FORBIDDEN_ID_TYPES.includes(command.type) &&
    datum.id != null;
  if (!forbidsId) { return; }

  const rightArg = command.multiple ? 'filter' : 'id';
  const message = `'data' argument at '${commandpath}' must not have an 'id' attribute '${datum.id}'. 'patch' commands cannot specify 'id' attributes in 'data' argument, because ids cannot be changed. Use '${rightArg}' argument instead.`;
  throwError(message, { reason: 'VALIDATION' });
};

const FORBIDDEN_ID_TYPES = ['patch'];

// Validate each attribute's value inside `args.data`
const validateDataValue = function ({
  value,
  attrName,
  commandpath,
  maxAttrValueSize,
}) {
  const isValueTooLong = typeof value === 'string' &&
    byteLength(value) > maxAttrValueSize;
  if (!isValueTooLong) { return; }

  const message = `'data' argument's '${commandpath}.${attrName}' attribute's value must be shorter than ${maxAttrValueSize} bytes`;
  throwError(message, { reason: 'VALIDATION' });
};

const isModelsType = function (val) {
  if (isModelType(val)) { return true; }

  return Array.isArray(val) && val.every(isModelType);
};

const isModelType = function (obj) {
  return obj &&
    obj.constructor === Object &&
    !isPatchOp(obj);
};

module.exports = {
  validateData,
  isModelsType,
  isModelType,
};
