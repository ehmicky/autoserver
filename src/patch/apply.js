'use strict';

const { mapValues } = require('../utilities');
const { runSchemaFunc } = require('../schema_func');

const { parsePatchOp } = require('./parse');
const { postValidate } = require('./validate');
const { parseRef } = require('./ref_parsing');

// Apply patch operation to a single datum
const applyPatchOps = function ({
  datum,
  patchOps,
  schema: { collections, operators },
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

const applyPatchOp = function ({
  datum,
  patchOp,
  attrName,
  attributes,
  ...rest
}) {
  const { type, opVal } = parsePatchOp(patchOp);

  // If no patch operator was used, do a simple shallow merge
  if (type === undefined) { return patchOp; }

  const attrVal = datum[attrName];
  // Normalize `null` to `undefined`
  const attrValA = attrVal === null ? undefined : attrVal;

  const attr = attributes[attrName];

  const attrValB = transformPatchOp({
    type,
    attrVal: attrValA,
    opVal,
    datum,
    patchOp,
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

  const vars = { $val: attrVal, $arg: opValB, $type: attrType };
  const attrValA = runSchemaFunc({ schemaFunc: apply, mInput, vars });
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
