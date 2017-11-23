'use strict';

const { uniq } = require('../../../utilities');

const { validateTypes } = require('./check');
const { TYPES } = require('./available');

// Uses `patchOp.attribute`
const checkAttrType = function ({
  type,
  attr: { type: attrType, isArray: attrIsArray },
  operator: { attribute },
}) {
  const attrTypes = [attrType];
  const validTypes = validateTypes({
    attrTypes,
    attrIsArray,
    possTypes: attribute,
  });
  if (validTypes === undefined) { return; }

  return `this attribute's type is invalid. Patch operator '${type}' can only be used on an attribute that is ${validTypes}`;
};

// Uses `patchOp.argument`
const checkOpValType = function ({ type, opVal, operator: { argument } }) {
  const { attrTypes, attrIsArray } = getOpValType(opVal);
  const validTypes = validateTypes({
    attrTypes,
    attrIsArray,
    possTypes: argument,
    strict: true,
  });
  if (validTypes === undefined) { return; }

  return `the argument's type of ${JSON.stringify(opVal)} is invalid. Patch operator '${type}' argument must be ${validTypes}`;
};

const getOpValType = function (opVal) {
  const attrIsArray = Array.isArray(opVal);

  if (!attrIsArray) {
    return parseOpValTypes({ values: [opVal], attrIsArray });
  }

  // Passing an empty array as operator argument, i.e. we do not know which
  // type it is
  if (opVal.length === 0) {
    return { attrTypes: ['none'], attrIsArray };
  }

  // We do not allow mixed array, so we can just check the first element
  return parseOpValTypes({ values: opVal, attrIsArray });
};

const parseOpValTypes = function ({ values, attrIsArray }) {
  const attrTypes = values.map(parseOpValType);
  const attrTypesA = uniq(attrTypes);
  return { attrTypes: attrTypesA, attrIsArray };
};

const parseOpValType = function (value) {
  const [attrType] = Object.entries(TYPES)
    .find(([, { test: testFunc }]) => testFunc(value));
  return attrType;
};

module.exports = {
  checkAttrType,
  checkOpValType,
};
