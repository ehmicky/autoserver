'use strict';

const { decapitalize } = require('underscore.string');

const { runConfigFunc } = require('../../functions');
const { addGenErrorHandler } = require('../../errors');
const { getReason } = require('../error');

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

  const params = { arg: opValA, type: attrType };
  const message = eRunConfigFunc({ configFunc: check, mInput, params, type });

  const messageA = getCheckMessage({ type, message });
  return messageA;
};

const eRunConfigFunc = addGenErrorHandler(runConfigFunc, { reason: getReason });

const getCheckMessage = function ({ type, message }) {
  if (message === undefined) { return; }

  if (typeof message === 'string') {
    return decapitalize(message);
  }

  const messageA = `patch operator '${type}' check() function must return either a string or undefined, not ${typeof message}`;
  const reason = getReason({ operator: type });
  return { message: messageA, reason };
};

module.exports = {
  applyCheck,
};
