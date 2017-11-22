'use strict';

// Values starting with `$model.` target sibling attributes
const parseSiblingNode = function ({ value, throwErr }) {
  const attrName = parseSibling({ value });

  if (attrName === undefined) { return; }

  const shortAttrName = attrName.replace(/\..*/, '');

  if (attrName === shortAttrName) {
    return { type: 'sibling', value: attrName };
  }

  const message = `Must not target children of sibling attributes: '${value}'. '$model.${shortAttrName}' should be used instead`;
  throwErr(message);
};

const parseSibling = function ({ value }) {
  const [, attrName] = SIBLING_REGEXP.exec(value) || [];
  return attrName;
};

// '$model.ATTR' -> 'ATTR'
const SIBLING_REGEXP = /\$model\.(.+)/;

const getSiblingAttrName = function ({ value, attrName }) {
  const isSibling = isSiblingValue({ value });
  if (!isSibling) { return { attrName, isSibling }; }

  const { value: attrNameA } = value;
  return { attrName: attrNameA, isSibling };
};

const isSiblingValue = function ({ value }) {
  return value &&
    value.constructor === Object &&
    value.type === 'sibling';
};

const getSiblingValue = function ({ value, attrName, attrs }) {
  const { attrName: attrNameA, isSibling } = getSiblingAttrName({
    value,
    attrName,
  });
  if (!isSibling) { return value; }

  const valueA = attrs[attrNameA];
  return valueA;
};

module.exports = {
  parseSiblingNode,
  getSiblingAttrName,
  getSiblingValue,
};
