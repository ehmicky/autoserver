'use strict';

const { mapValues } = require('../../../utilities');
const { throwError } = require('../../../error');

const validateSameType = function ({
  opVal,
  opName,
  attrName,
  attr,
  attr: { type, isArray },
}) {
  const typeValidator = getTypeValidator({ attr });
  if (opVal === undefined || typeValidator(opVal)) { return; }

  const message = isArray ? `an array of type '${type}'` : `of type ${type}`;
  throwAttrValError(attrName, opName, message);
};

const oneTypeValidators = {
  string: opVal => typeof opVal === 'string',
  number: opVal => Number.isFinite(opVal),
  integer: opVal => Number.isInteger(opVal),
  boolean: opVal => typeof opVal === 'boolean',
};

const getManyTypeValidators = function () {
  return mapValues(
    oneTypeValidators,
    validator => opVal => Array.isArray(opVal) && opVal.every(validator),
  );
};

const typeValidators = {
  one: oneTypeValidators,
  many: getManyTypeValidators(),
};

const getTypeValidator = function ({ attr: { type, isArray } }) {
  return typeValidators[isArray ? 'many' : 'one'][type];
};

const validateArray = function ({ opVal, opName, attrName, attr }) {
  if (!Array.isArray(opVal)) {
    throwAttrValError(attrName, opName, 'an array');
  }

  opVal
    .forEach(val => validateSameType({ opVal: val, opName, attrName, attr }));
};

const validateLike = function ({
  opVal,
  attrName,
  opName,
  attr: { type, isArray },
}) {
  if (typeof opVal !== 'string') {
    throwAttrValError(attrName, opName, 'a string');
  }

  if (type !== 'string') {
    throwAttrTypeError(attrName, opName, 'not a string');
  }

  if (isArray) {
    throwAttrTypeError(attrName, opName, 'an array');
  }
};

const validateArrayOps = function ({ opName, attrName, attr: { isArray } }) {
  if (!isArray) {
    throwAttrTypeError(attrName, opName, 'not an array');
  }
};

const throwAttrValError = function (attrName, opName, message) {
  const msg = `In 'filter' argument, the value of operator '${opName}' for attribute '${attrName}' should be ${message}`;
  throwError(msg, { reason: 'INPUT_VALIDATION' });
};

const throwAttrTypeError = function (attrName, opName, message) {
  const msg = `In 'filter' argument, the operator '${opName}' must not be used because the attribute '${attrName}' is ${message}`;
  throwError(msg, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  validateSameType,
  validateArray,
  validateLike,
  validateArrayOps,
};
