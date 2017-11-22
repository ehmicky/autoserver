'use strict';

const { get } = require('../../utilities');
const { DEEP_OPERATORS } = require('../operators');

// In `{ attribute: { _some: { _eq: value } } }`, `_eq` is considered deep
const getDeepAttr = function ({ attrs, attrName, throwErr }) {
  const [, attrNameA, , deepType] = DEEP_TYPE_REGEXP.exec(attrName) || [];

  const attr = getAttr({ attrs, attrName: attrNameA, throwErr });

  const isDeep = DEEP_OPERATORS.includes(deepType);
  if (isDeep) { return { ...attr, isArray: false }; }

  return attr;
};

// Matches '$attrName _some|_all' -> ['$attrName', '_some|_all']
const DEEP_TYPE_REGEXP = /^([^ ]*)( (.*))?$/;

const getAttr = function ({ attrs, attrName, throwErr }) {
  const attrParts = attrName.split('.');

  // Use `get()` for nested attributes
  const attr = get(attrs, attrParts);
  if (attr !== undefined) { return attr; }

  // Dynamic attributes, where attrName can be anything
  const attrA = attrs[attrParts[0]];
  if (attrA !== undefined && attrA.type === 'dynamic') { return attrA; }

  const message = `Attribute '${attrName}' is unknown`;
  throwErr(message);
};

module.exports = {
  getDeepAttr,
};
