'use strict';

const { mapValues } = require('../utilities');
const { runConfigFunc } = require('../functions');

const { parsePatchOp } = require('./parse');
const { parseRef } = require('./ref_parsing');
const { replaceSimpleRef, replaceRef } = require('./ref');

// Apply patch operation to a single datum
const applyPatchOps = function ({
  datum,
  patchOps,
  config: { collections, operators },
  collname,
  ...rest
}) {
  const { attributes } = collections[collname];

  const patchOpsA = mapValues(patchOps, (patchOp, attrName) => applyPatchOp({
    datum,
    patchOp,
    attrName,
    attributes,
    operators,
    ...rest,
  }));

  return { ...datum, ...patchOpsA };
};

const applyPatchOp = function ({ patchOp, ...rest }) {
  const { type, opVal } = parsePatchOp(patchOp);

  if (type === undefined) {
    return getSimplePatch({ patchOp, ...rest });
  }

  return getAdvancedPatch({ patchOp, type, opVal, ...rest });
};

// If no patch operator was used, do a simple shallow merge
const getSimplePatch = function ({ patchOp, attributes, datum, commandpath }) {
  const ref = parseRef(patchOp);
  if (ref === undefined) { return patchOp; }

  return replaceSimpleRef({ ref, attributes, datum, commandpath });
};

// When a patch operator was used
const getAdvancedPatch = function ({ datum, attrName, attributes, ...rest }) {
  const attrVal = datum[attrName];
  // Normalize `null` to `undefined`
  const attrValA = attrVal === null ? undefined : attrVal;

  const attr = attributes[attrName];

  const attrValB = transformPatchOp({
    attrVal: attrValA,
    datum,
    attrName,
    attr,
    ...rest,
  });
  return attrValB;
};

const transformPatchOp = function ({ type, attrVal, operators, ...rest }) {
  // Uses `patchOp.apply()`, i.e. transform patch operations
  // into normal values to merge
  const operator = operators[type];

  const shouldIterate = shouldIterateOp({ attrVal, operator });

  if (!shouldIterate) {
    return fireApply({ operator, attrVal, type, ...rest });
  }

  return attrVal.map(attrValA =>
    fireApply({ operator, attrVal: attrValA, type, ...rest }));
};

// When the patch operator is not specific to array attributes, but the
// attribute is an array, the patch operator is being iterator
const shouldIterateOp = function ({ attrVal, operator: { attribute } }) {
  return Array.isArray(attrVal) &&
    attribute !== undefined &&
    attribute.every(attr => !attr.endsWith('[]'));
};

// Do the actual merging operation
const fireApply = function ({
  operator,
  operator: { apply },
  attr,
  attr: { type: attrType },
  attrVal,
  mInput,
  ...rest
}) {
  const opValA = replaceRef({ operator, mInput, attr, ...rest });

  // Normalize `null` to `undefined`
  const opValB = opValA === null ? undefined : opValA;

  const params = { value: attrVal, arg: opValB, type: attrType };
  const attrValA = runConfigFunc({ configFunc: apply, mInput, params });
  return attrValA;
};

module.exports = {
  applyPatchOps,
};
