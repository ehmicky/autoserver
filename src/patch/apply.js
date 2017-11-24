'use strict';

const { mapValues } = require('../utilities');

const { parsePatchOp } = require('./parse');
const { OPERATORS } = require('./operators');

// Apply patch operation to a single datum
const applyPatchOps = function ({ datum, patchOps }) {
  const patchOpsA = mapValues(
    patchOps,
    (patchOp, attrName) => applyPatchOp({ datum, patchOp, attrName }),
  );

  return { ...datum, ...patchOpsA };
};

const applyPatchOp = function ({ datum, patchOp, attrName }) {
  const { type, opVal } = parsePatchOp(patchOp);

  // If no patch operator was used, do a simple shallow merge
  if (type === undefined) { return patchOp; }

  const attrVal = datum[attrName];
  // Patch operators skip attributes whose values are empty
  if (attrVal == null) { return attrVal; }

  const attrValA = transformPatchOp({ type, attrVal, opVal });
  return attrValA;
};

const transformPatchOp = function ({ type, attrVal, opVal }) {
  // Uses `patchOp.apply()`, i.e. transform patch operations
  // into normal values to merge
  const { apply, attribute } = OPERATORS[type];

  const shouldIterate = shouldIterateOp({ attrVal, attribute });

  if (!shouldIterate) {
    return apply(attrVal, opVal);
  }

  return attrVal.map(attrValA => apply(attrValA, opVal));
};

// When the patch operator is not specific to array attributes, but the
// attribute is an array, the patch operator is being iterator
const shouldIterateOp = function ({ attrVal, attribute }) {
  return Array.isArray(attrVal) &&
    attribute.every(attr => !attr.endsWith('[]'));
};

module.exports = {
  applyPatchOps,
};
