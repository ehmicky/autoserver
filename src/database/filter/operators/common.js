'use strict';

const { mapValues } = require('../../../utilities');

const { throwAttrValError, throwAttrTypeError } = require('./error');

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

const validateNotArrayOps = function ({ opName, attrName, attr, throwErr }) {
  if (!attr.isArray) { return; }

  throwAttrTypeError({ attrName, attr, opName, throwErr }, 'an array');
};

const parseAsIs = function ({ opVal }) {
  return opVal;
};

module.exports = {
  validateSameType,
  validateNotArrayOps,
  parseAsIs,
};
