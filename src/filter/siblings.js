'use strict';

const { NO_SIBLINGS_OPERATORS } = require('./operators');

// Values starting with `$model.` target sibling attributes
const parseSiblingNode = function ({ type, value, throwErr }) {
  const attrName = parseSibling({ value });

  if (attrName === undefined) { return; }

  validateForbiddenOps({ type, throwErr });

  const shortAttrName = attrName.replace(/\..*/, '');

  if (attrName === shortAttrName) {
    return { type: 'sibling', value: attrName };
  }

  const message = `Must not target children of sibling attributes: '${value}'. '$model.${shortAttrName}' should be used instead`;
  throwErr(message);
};

const validateForbiddenOps = function ({ type, throwErr }) {
  if (!NO_SIBLINGS_OPERATORS.includes(type)) { return; }

  const message = `Cannot prefix the value with '$model.' when using the '${type}' operator`;
  throwErr(message);
};

const parseSibling = function ({ value }) {
  const [, attrName] = SIBLING_REGEXP.exec(value) || [];
  return attrName;
};

// '$model.ATTR' -> 'ATTR'
const SIBLING_REGEXP = /\$model\.(.+)/;

const isSiblingValue = function ({ value }) {
  return value &&
    value.constructor === Object &&
    value.type === 'sibling';
};

const getSiblingValue = function ({ value, attrs }) {
  const isSibling = isSiblingValue({ value });
  if (!isSibling) { return value; }

  const { value: attrNameA } = value;

  const valueA = attrs[attrNameA];
  return valueA;
};

module.exports = {
  parseSiblingNode,
  validateForbiddenOps,
  isSiblingValue,
  getSiblingValue,
};
