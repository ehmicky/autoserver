'use strict';

const { get } = require('../../utilities');
const { DEEP_OPERATORS } = require('../operators');

// In `{ attribute: { _some: { _eq: value } } }`, `_eq` is considered deep
const getDeepAttr = function ({ attrs, attrName, throwErr }) {
  const [, attrNameA, , deepType] = DEEP_TYPE_REGEXP.exec(attrName) || [];
  const isDeep = DEEP_OPERATORS.includes(deepType);

  const attr = getAttr({ attrs, attrName: attrNameA, throwErr });

  return isDeep ? { ...attr, isArray: false } : attr;
};

// Matches '$attrName _some|_all' -> ['$attrName', '_some|_all']
const DEEP_TYPE_REGEXP = /^([^ ]*)( (.*))?$/;

const getAttr = function ({ attrs, attrName, throwErr }) {
  const [topAttr, ...otherAttrs] = attrName.split('.');

  // Use `get()` for nested attributes
  const attr = get(attrs, [topAttr, ...otherAttrs]);
  if (attr !== undefined) { return attr; }

  // Dynamic attributes, where attrName can be anything
  const attrA = attrs[topAttr];
  if (attrA !== undefined && attrA.type === 'dynamic') { return attrA; }

  const message = `Attribute '${attrName}' is unknown`;
  throwErr(message);
};

module.exports = {
  getDeepAttr,
};
