'use strict';

const { mapValues } = require('../utilities');

const { parsePatchOp } = require('./parse');
const { OPERATORS } = require('./operators');
const { postValidate } = require('./validate');
const { parseRef } = require('./ref_parsing');

// Apply patch operation to a single datum
const applyPatchOps = function ({ datum, patchOps, commandpath }) {
  const patchOpsA = mapValues(
    patchOps,
    (patchOp, attrName) =>
      applyPatchOp({ datum, patchOp, attrName, commandpath }),
  );

  return { ...datum, ...patchOpsA };
};

const applyPatchOp = function ({ datum, patchOp, attrName, commandpath }) {
  const { type, opVal } = parsePatchOp(patchOp);

  // If no patch operator was used, do a simple shallow merge
  if (type === undefined) { return patchOp; }

  const attrVal = datum[attrName];
  // Patch operators skip attributes whose values are empty
  if (attrVal == null) { return attrVal; }

  const attrValA = transformPatchOp({
    type,
    attrVal,
    opVal,
    datum,
    patchOp,
    commandpath,
    attrName,
  });
  return attrValA;
};

const transformPatchOp = function ({ type, attrVal, ...rest }) {
  // Uses `patchOp.apply()`, i.e. transform patch operations
  // into normal values to merge
  const operator = OPERATORS[type];

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
    attribute.every(attr => !attr.endsWith('[]'));
};

// Do the actual merging operation
const fireApply = function ({
  operator,
  operator: { apply },
  attrVal,
  ...rest
}) {
  const opValA = replaceRef({ operator, ...rest });

  // Normalize `null` to `undefined`
  const opValB = opValA === null ? undefined : opValA;

  const attrValA = apply(attrVal, opValB);
  return attrValA;
};

// Replaces $model.ATTR when patch operation is applied
const replaceRef = function ({ opVal, datum, ...rest }) {
  const ref = parseRef(opVal);
  if (ref === undefined) { return opVal; }

  const opValA = datum[ref];

  postValidate({ opVal: opValA, ...rest });

  return opValA;
};

module.exports = {
  applyPatchOps,
};
