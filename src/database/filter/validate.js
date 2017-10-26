'use strict';

const { mapValues } = require('../../utilities');
const { addErrorHandler } = require('../../error');

const validateSameType = function ({
  opVal,
  opName,
  attrName,
  attr,
  attr: { type, isArray },
  throwErr,
}) {
  validateNotArrayOps({ opName, attrName, attr, throwErr });

  const typeValidator = getTypeValidator({ attr });
  if (opVal === undefined || typeValidator(opVal)) { return; }

  const message = isArray ? `an array of type '${type}'` : `of type ${type}`;
  throwAttrValError({ attrName, opName, throwErr }, message);
};

const oneTypeValidators = {
  string: opVal => typeof opVal === 'string',
  number: opVal => Number.isFinite(opVal),
  integer: opVal => Number.isInteger(opVal),
  boolean: opVal => typeof opVal === 'boolean',
  dynamic: () => true,
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

const validateArray = function ({ opVal, opName, attrName, attr, throwErr }) {
  validateNotArrayOps({ opName, attrName, attr, throwErr });

  if (!Array.isArray(opVal)) {
    throwAttrValError({ attrName, opName, throwErr }, 'an array');
  }

  opVal.forEach(val =>
    validateSameType({ opVal: val, opName, attrName, attr, throwErr }));
};

const validateLike = function ({
  opVal,
  attrName,
  opName,
  attr,
  attr: { type, isArray },
  throwErr,
}) {
  validateNotArrayOps({ opName, attrName, attr, throwErr });

  if (typeof opVal !== 'string') {
    throwAttrValError({ attrName, opName, throwErr }, 'a string');
  }

  if (type !== 'string') {
    throwAttrTypeError({ attrName, attr, opName, throwErr }, 'not a string');
  }

  if (isArray) {
    throwAttrTypeError({ attrName, attr, opName, throwErr }, 'an array');
  }

  eValidateRegExp({ opVal, throwErr });
};

// Validate it is correct regexp
const validateRegExp = function ({ opVal }) {
  // eslint-disable-next-line no-new
  new RegExp(opVal);
};

const regExpParserHandler = function (_, { opVal, throwErr }) {
  const message = `Invalid regular expression: '${opVal}'`;
  throwErr(message);
};

const eValidateRegExp = addErrorHandler(validateRegExp, regExpParserHandler);

const validateArrayOps = function ({ opName, attrName, attr, throwErr }) {
  if (attr.isArray) { return; }

  throwAttrTypeError({ attrName, attr, opName, throwErr }, 'not an array');
};

const validateNotArrayOps = function ({ opName, attrName, attr, throwErr }) {
  if (!attr.isArray) { return; }

  throwAttrTypeError({ attrName, attr, opName, throwErr }, 'an array');
};

const throwAttrValError = function ({ opName, throwErr }, message) {
  const msg = `The value of operator '${opName}' should be ${message}`;
  throwErr(msg);
};

const throwAttrTypeError = function (
  { attrName, attr: { type }, opName, throwErr },
  message,
) {
  if (type === 'dynamic') { return; }

  const msg = `The operator '${opName}' must not be used because '${attrName}' is ${message}`;
  throwErr(msg);
};

module.exports = {
  validateSameType,
  validateArray,
  validateLike,
  validateArrayOps,
};
