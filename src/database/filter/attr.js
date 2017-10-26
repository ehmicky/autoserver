'use strict';

const { isInlineFunc } = require('../../schema_func');

const { operators } = require('./operators');

const parseAttrs = function ({ attrVal, attrName, attr, throwErr }) {
  // `{ attribute: value }` is a shortcut for `{ attribute: { eq: value } }`
  const attrValA = attrVal && attrVal.constructor === Object
    ? attrVal
    : { eq: attrVal };

  return Object.entries(attrValA).map(([opName, opVal]) =>
    parseAttr({ opName, opVal, attrName, attr, throwErr }));
};

const parseAttr = function ({ opName, opVal, attrName, attr, throwErr }) {
  const operator = operators[opName];

  if (operator === undefined) {
    const message = `Must not use unknown operator '${opName}'`;
    throwErr(message);
  }

  // Normalize `null|undefined` to only `undefined`
  const opValA = opVal === null ? undefined : opVal;

  validateAttr({ operator, opVal: opValA, opName, attrName, attr, throwErr });

  // Pass `parseAttrs` for recursion
  const value = operator.parse({
    opVal: opValA,
    attrName,
    attr,
    throwErr,
    parseAttrs,
  });
  return { type: opName, value };
};

const validateAttr = function ({
  operator,
  opVal,
  opName,
  attrName,
  attr,
  attr: { allowInlineFuncs },
  throwErr,
}) {
  // E.g. `model.authorize` allows schema functions
  if (allowInlineFuncs && isInlineFunc({ inlineFunc: opVal })) { return; }

  operator.validate({ opVal, opName, attrName, attr, throwErr });
};

module.exports = {
  parseAttrs,
};
