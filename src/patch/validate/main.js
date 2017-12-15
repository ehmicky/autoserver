'use strict';

const { throwError } = require('../../error');
const { parsePatchOp } = require('../parse');

const { PRE_VALIDATORS } = require('./pre_validators');
const { POST_VALIDATORS } = require('./post_validators');

// Validate patch operation has valid syntax, during args.data parsing
const preValidate = function ({
  patchOp,
  commandpath,
  attrName,
  top,
  maxAttrValueSize,
  coll,
  coll: { attributes },
  mInput,
  config: { operators },
}) {
  const attr = attributes[attrName];

  const { type, opVal } = parsePatchOp(patchOp);

  // E.g. if this is not a patch operation
  if (type === undefined) { return; }

  const operator = operators[type];
  const validators = PRE_VALIDATORS;

  validatePatchOp({
    patchOp,
    top,
    operator,
    type,
    opVal,
    attr,
    coll,
    maxAttrValueSize,
    commandpath,
    attrName,
    validators,
    mInput,
  });
};

// Validate patch operation has valid syntax, after model.ATTR resolution
const postValidate = function (input) {
  const validators = POST_VALIDATORS;

  validatePatchOp({ ...input, validators });
};

// Try each validator in order, stopping at the first one that returns an error
const validatePatchOp = function (input) {
  const { commandpath, attrName, patchOp, validators } = input;

  const validatorA = validators
    .find(validator => validator(input) !== undefined);
  if (validatorA === undefined) { return; }

  const error = validatorA(input);

  checkError({ error, commandpath, attrName, patchOp });
};

const checkError = function ({ error, commandpath, attrName, patchOp }) {
  const { message, reason } = typeof error === 'string'
    ? { message: error, reason: 'INPUT_VALIDATION' }
    : error;

  const commandpathA = [...commandpath, attrName].join('.');
  const messageA = `At '${commandpathA}', wrong operation '${JSON.stringify(patchOp)}': ${message}`;
  throwError(messageA, { reason });
};

module.exports = {
  preValidate,
  postValidate,
};
