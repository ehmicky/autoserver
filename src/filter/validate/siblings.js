'use strict';

const { getSiblingAttrName } = require('../siblings');

const { getAttr } = require('./attr');

// When using `$model.ATTR` to target a sibling attribute
// Replace sibling attribute's value by a dummy value, since it is not known
// yet, but we still want to validate for example that sibling attribute is of
// the right attribute
const getSiblingValue = function ({ value, attrs, attrName, throwErr }) {
  const { attrName: attrNameA, isSibling } = getSiblingAttrName({
    value,
    attrName,
  });
  if (!isSibling) { return value; }

  // In `model.authorize`, model is under `$model`.
  // In `args.filter`, it is top-level
  const attrNameB = attrs.$model === undefined
    ? attrNameA
    : `$model.${attrNameA}`;

  // This also validates that sibling attribute exists
  const attr = getAttr({ attrs, attrName: attrNameB, throwErr });

  const valueA = getDummyValue({ attr });
  return valueA;
};

const getDummyValue = function ({ attr: { type, isArray } }) {
  const valueA = DUMMY_VALUES[type];
  const valueB = isArray ? [valueA] : valueA;
  return valueB;
};

const DUMMY_VALUES = {
  string: '',
  number: 0,
  integer: 0,
  boolean: true,
  dynamic: '',
};

module.exports = {
  getSiblingValue,
};
