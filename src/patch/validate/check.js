'use strict';

const { decapitalize } = require('underscore.string');

const { runSchemaFunc } = require('../../schema_func');

// Uses `patchOp.check()`
const applyCheck = function ({
  opVal,
  type,
  operator: { check },
  attr: { type: attrType },
  mInput,
}) {
  if (check === undefined) { return; }

  // Normalize `null` to `undefined`
  const opValA = opVal === null ? undefined : opVal;

  const vars = { $arg: opValA, $type: attrType };
  const message = runSchemaFunc({ schemaFunc: check, mInput, vars });

  const messageA = getCheckMessage({ type, message });
  return messageA;
};

const getCheckMessage = function ({ type, message }) {
  if (message === undefined) { return; }

  if (typeof message === 'string') {
    return decapitalize(message);
  }

  const messageA = `patch operator '${type}' check() function must return either a string or undefined, not ${typeof message}`;
  return { message: messageA, reason: 'UTILITY_ERROR' };
};

module.exports = {
  applyCheck,
};
