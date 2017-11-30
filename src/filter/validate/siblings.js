'use strict';

const { isSiblingValue, validateForbiddenOps } = require('../siblings');
const { DEEP_OPERATORS } = require('../operators');

const { getAttr } = require('./attr');

// When using `model.ATTR` to target a sibling attribute
// Replace sibling attribute's value by a dummy value, since it is not known
// yet, but we still want to validate for example that sibling attribute is of
// the right attribute
const getSiblingValue = function ({
  node,
  node: { value, type },
  attrs,
  throwErr,
}) {
  const isSibling = hasSiblingValue({ node });
  if (!isSibling) { return value; }

  validateForbiddenOps({ type, throwErr });

  const { value: attrName } = value;

  // In `model.authorize`, model is under `model`.
  // In `args.filter`, it is top-level
  const attrNameA = attrs.model === undefined
    ? attrName
    : `model.${attrName}`;

  // This also validates that sibling attribute exists
  const attr = getAttr({ attrs, attrName: attrNameA, throwErr });

  const valueA = getDummyValue({ attr });
  return valueA;
};

const hasSiblingValue = function ({ node: { type, value } }) {
  if (DEEP_OPERATORS.includes(type) && Array.isArray(value)) {
    return value.some(nodeA => hasSiblingValue({ node: nodeA }));
  }

  return isSiblingValue({ value });
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
