'use strict';

const { throwError } = require('../../error');
const { parsePatchOp } = require('../parse');
const { OPERATORS } = require('../operators');

const { validators } = require('./validators');

// Validate patch operation has valid syntax
const validatePatchOp = function ({
  patchOp,
  commandpath,
  attrName,
  attributes,
  top,
  maxAttrValueSize,
}) {
  const commandpathA = [...commandpath, attrName];
  const attr = attributes[attrName];

  validatePatch({
    patchOp,
    commandpath: commandpathA,
    top,
    attr,
    maxAttrValueSize,
  });
};

const validatePatch = function ({
  patchOp,
  commandpath,
  top,
  attr,
  maxAttrValueSize,
}) {
  const { type, opVal } = parsePatchOp(patchOp);

  // E.g. if this is not a patch operation
  if (type === undefined) { return; }

  const operator = OPERATORS[type];

  const { message, reason = 'INPUT_VALIDATION' } = getResult({
    patchOp,
    top,
    operator,
    type,
    opVal,
    attr,
    maxAttrValueSize,
  });
  if (message === undefined) { return; }

  const messageA = `At '${commandpath.join('.')}', wrong operation '${JSON.stringify(patchOp)}': ${message}`;
  throwError(messageA, { reason });
};

// Try each validator in order, stopping at the first one that returns an error
const getResult = function (input) {
  const validatorA = validators.find(validator => validator(input));
  if (validatorA === undefined) { return {}; }

  const result = validatorA(input);

  if (typeof result === 'string') {
    return { message: result };
  }

  return result;
};

module.exports = {
  validatePatchOp,
};
