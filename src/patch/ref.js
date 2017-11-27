'use strict';

const { parseRef, isRef } = require('./ref_parsing');

// Get the schema's attribute from a $model.ATTR reference
const getOpValRef = function ({ opVal, coll: { attributes } }) {
  const ref = parseRef(opVal);
  if (ref === undefined) { return; }

  const attr = attributes[ref];

  if (attr === undefined) {
    return `attribute '${ref}' is unknown`;
  }

  const { type, isArray } = attr;
  return { attrTypes: [type], attrIsArray: isArray };
};

// If operator's argument can only be `empty`, we cannot check $model.ATTR
// until it is resolved later.
// If operator's argument contains `empty` but other types too, we can already
// check $model.ATTR against them.
const cannotCheckType = function ({ opVal, argument }) {
  return isRef(opVal) && argument.length === 1 && argument[0] === 'empty';
};

module.exports = {
  getOpValRef,
  cannotCheckType,
};
