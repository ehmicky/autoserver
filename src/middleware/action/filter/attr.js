'use strict';

const { throwError, addGenErrorHandler } = require('../../../error');

const {
  validateSameType,
  validateArray,
  validateLike,
  validateArrayOps,
} = require('./validate');

const parseAttributes = function ({ attrVal, attrName, attr }) {
  // `{ attribute: value }` is a shortcut for `{ attribute: { eq: value } }`
  const attrValA = attrVal && attrVal.constructor === Object
    ? attrVal
    : { eq: attrVal };

  return Object.entries(attrValA).map(([opName, opVal]) =>
    parseAttribute({ opName, opVal, attrName, attr }));
};

const parseAttribute = function ({ opName, opVal, attrName, attr }) {
  const operation = operations[opName];

  if (operation === undefined) {
    const message = `In 'filter' argument, must not use unknown operator '${opName}'`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  // Normalize `null|undefined` to only `undefined`
  const opValA = opVal === null ? undefined : opVal;

  operation.validate({ opVal: opValA, opName, attrName, attr });
  const value = operation.parse({ opVal: opValA, attrName, attr });
  return { type: opName, value };
};

const asIsParser = function ({ opVal }) {
  return opVal;
};

const regexParser = function ({ opVal }) {
  return new RegExp(opVal);
};

const eRegExpParser = addGenErrorHandler(regexParser, {
  message: ({ opVal }) => `'filter' argument contains an invalid regular expression: '${opVal}'`,
  reason: 'INPUT_VALIDATION',
});

const arrayOpsParser = function ({ opVal, attrName, attr: { type } }) {
  return parseAttributes({
    attrVal: opVal,
    attrName,
    attr: { type, isArray: false },
  });
};

const operations = {
  eq: { parse: asIsParser, validate: validateSameType },
  neq: { parse: asIsParser, validate: validateSameType },
  in: { parse: asIsParser, validate: validateArray },
  nin: { parse: asIsParser, validate: validateArray },
  lte: { parse: asIsParser, validate: validateSameType },
  lt: { parse: asIsParser, validate: validateSameType },
  gte: { parse: asIsParser, validate: validateSameType },
  gt: { parse: asIsParser, validate: validateSameType },
  like: { parse: eRegExpParser, validate: validateLike },
  nlike: { parse: eRegExpParser, validate: validateLike },
  some: { parse: arrayOpsParser, validate: validateArrayOps },
  all: { parse: arrayOpsParser, validate: validateArrayOps },
};

module.exports = {
  parseAttributes,
};
