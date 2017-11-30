'use strict';

const pluralize = require('pluralize');

const { getWordsList } = require('../../utilities');
const { isPatchOpName } = require('../parse');
const { isRef } = require('../ref_parsing');

const { checkAttrType, checkOpValType } = require('./types');
const { applyCheck } = require('./check');

const attributeExists = function ({ attr }) {
  if (attr !== undefined) { return; }

  return 'attribute is unknown';
};

const isPatchCommand = function ({ top: { command } }) {
  if (command.type === 'patch') { return; }

  return 'only patch commands can use patch operators';
};

// Patch operations cannot be mixed with nested patch actions
const isNotMixed = function ({ patchOp }) {
  const patchOps = Object.keys(patchOp).filter(isPatchOpName);
  const attrNames = Object.keys(patchOp).filter(key => !isPatchOpName(key));
  if (attrNames.length === 0) { return; }

  const patchOpsA = getWordsList(patchOps, { op: 'and', quotes: true });
  const attrNamesA = getWordsList(attrNames, { op: 'and', quotes: true });
  return `cannot mix patch ${pluralize('operators', patchOps.length)} ${patchOpsA} with regular ${pluralize('attribute', attrNames.length)} ${attrNamesA}`;
};

const isSingleOp = function ({ patchOp }) {
  const isSingle = Object.keys(patchOp).length === 1;
  if (isSingle) { return; }

  return 'can only specify one patch operator per attribute';
};

// Check against `maxAttrValueSize` limit
const isWithinLimits = function ({ opVal, maxAttrValueSize }) {
  const size = getSize({ opVal });
  if (size <= maxAttrValueSize) { return; }

  return `the argument must be shorter than ${maxAttrValueSize} bytes`;
};

const getSize = function ({ opVal }) {
  const opValA = typeof opVal === 'string' ? opVal : JSON.stringify(opVal);

  const size = Buffer.byteLength(opValA);
  return size;
};

const operatorExists = function ({ operator, type }) {
  if (operator !== undefined) { return; }

  return `operator '${type}' is unknown`;
};

const checkOpVal = function ({ opVal, ...rest }) {
  // `patchOp.check()` is not performed if value is `model.ATTR` reference
  // It will be performed later when reference's value is known
  if (isRef(opVal)) { return; }

  const message = applyCheck({ opVal, ...rest });
  return message;
};

// Validation applied during `args.data` parsing
const PRE_VALIDATORS = [
  attributeExists,
  isPatchCommand,
  isNotMixed,
  isSingleOp,
  operatorExists,
  isWithinLimits,
  checkAttrType,
  checkOpValType,
  checkOpVal,
];

module.exports = {
  PRE_VALIDATORS,
};
