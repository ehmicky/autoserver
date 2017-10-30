'use strict';

const { mapValues } = require('../../utilities');
const { throwAttrValError, throwAttrTypeError } = require('../error');

const parseAsIs = function ({ value }) {
  return value;
};

const validateSameType = function ({
  type,
  value,
  attr,
  attr: { type: attrType, isArray },
  throwErr,
}) {
  validateNotArrayOps({ type, attr, throwErr });

  const typeValidator = getTypeValidator({ attr });
  if (value === undefined || typeValidator(value)) { return; }

  const message = isArray
    ? `an array of type '${attrType}'`
    : `of type ${attrType}`;
  throwAttrValError({ type, throwErr }, message);
};

const oneTypeValidators = {
  string: value => typeof value === 'string',
  number: value => Number.isFinite(value),
  integer: value => Number.isInteger(value),
  boolean: value => typeof value === 'boolean',
  dynamic: () => true,
};

const getManyTypeValidators = function () {
  return mapValues(
    oneTypeValidators,
    validator => value => Array.isArray(value) && value.every(validator),
  );
};

const typeValidators = {
  one: oneTypeValidators,
  many: getManyTypeValidators(),
};

const getTypeValidator = function ({ attr: { type: attrType, isArray } }) {
  return typeValidators[isArray ? 'many' : 'one'][attrType];
};

const validateNotArrayOps = function ({ type, attr, throwErr }) {
  if (!attr.isArray) { return; }

  throwAttrTypeError({ attr, type, throwErr }, 'an array');
};

module.exports = {
  parseAsIs,
  validateSameType,
  validateNotArrayOps,
};
