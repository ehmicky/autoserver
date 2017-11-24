'use strict';

const { uniq } = require('../../../utilities');
const { getOpValRef, cannotCheckType } = require('../../ref');

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
const checkOpValType = function ({
  type,
  opVal,
  coll,
  operator: { argument },
}) {
  const attrOrMessage = getOpValType({ opVal, coll, argument });

  if (attrOrMessage === undefined) { return; }

  if (typeof attrOrMessage === 'string') { return attrOrMessage; }

  const { attrTypes, attrIsArray } = attrOrMessage;
  const validTypes = validateTypes({
    attrTypes,
    attrIsArray,
    possTypes: argument,
    strict: true,
  });
  if (validTypes === undefined) { return; }

  return `the argument's type of ${JSON.stringify(opVal)} is invalid. Patch operator '${type}' argument must be ${validTypes}`;
};

const getOpValType = function ({ opVal, coll, argument }) {
  const cannotCheck = cannotCheckType({ opVal, argument });
  if (cannotCheck) { return; }

  const attrOrMessage = getOpValRef({ opVal, coll });
  if (attrOrMessage !== undefined) { return attrOrMessage; }

  const attrIsArray = Array.isArray(opVal);
  const attrTypes = getAttrTypes({ attrIsArray, opVal });

  return { attrIsArray, attrTypes };
};

const getAttrTypes = function ({ attrIsArray, opVal }) {
  if (!attrIsArray) {
    const attrType = parseOpValType(opVal);
    return [attrType];
  }

  // Passing an empty array as operator argument, i.e. we do not know which
  // type it is
  if (opVal.length === 0) {
    return ['none'];
  }

  // We do not allow mixed array, so we can just check the first element
  const attrTypes = parseOpValTypes(opVal);
  return attrTypes;
};

const parseOpValTypes = function (opVal) {
  const attrTypes = opVal.map(parseOpValType);
  const attrTypesA = uniq(attrTypes);
  return attrTypesA;
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
