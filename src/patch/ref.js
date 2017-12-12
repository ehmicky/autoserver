'use strict';

const { throwError } = require('../error');

const { parseRef, isRef } = require('./ref_parsing');
const { postValidate } = require('./validate');

// Get the config's attribute from a model.ATTR reference
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

// If operator's argument can only be `empty`, we cannot check model.ATTR
// until it is resolved later.
// If operator's argument contains `empty` but other types too, we can already
// check model.ATTR against them.
const cannotCheckType = function ({ opVal, argument }) {
  return isRef(opVal) && argument.length === 1 && argument[0] === 'empty';
};

// Replaces model.ATTR in simple patch operations (i.e. with no operators)
const replaceSimpleRef = function ({ ref, attributes, datum, commandpath }) {
  if (attributes[ref] !== undefined) {
    return datum[ref];
  }

  const message = `At '${commandpath.join('.')}': attribute '${ref}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

// Replaces model.ATTR when patch operation is applied
const replaceRef = function ({ opVal, datum, ...rest }) {
  const ref = parseRef(opVal);
  if (ref === undefined) { return opVal; }

  const opValA = datum[ref];

  postValidate({ opVal: opValA, ...rest });

  return opValA;
};

module.exports = {
  getOpValRef,
  cannotCheckType,
  replaceSimpleRef,
  replaceRef,
};
