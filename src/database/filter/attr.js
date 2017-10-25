'use strict';

const { addErrorHandler } = require('../../error');

const {
  validateSameType,
  validateArray,
  validateLike,
  validateArrayOps,
} = require('./validate');

const parseAttributes = function ({ attrVal, attrName, attr, throwErr }) {
  const throwErrA = throwErr.bind(null, `For '${attrName}', `);

  // `{ attribute: value }` is a shortcut for `{ attribute: { eq: value } }`
  const attrValA = attrVal && attrVal.constructor === Object
    ? attrVal
    : { eq: attrVal };

  return Object.entries(attrValA).map(([opName, opVal]) =>
    parseAttribute({ opName, opVal, attrName, attr, throwErr: throwErrA }));
};

const parseAttribute = function ({ opName, opVal, attrName, attr, throwErr }) {
  const operation = operations[opName];

  if (operation === undefined) {
    const message = `Must not use unknown operator '${opName}'`;
    throwErr(message);
  }

  // Normalize `null|undefined` to only `undefined`
  const opValA = opVal === null ? undefined : opVal;

  operation.validate({ opVal: opValA, opName, attrName, attr, throwErr });

  const value = operation.parse({ opVal: opValA, attrName, attr, throwErr });
  return { type: opName, value };
};

const asIsParser = function ({ opVal }) {
  return opVal;
};

const regexParser = function ({ opVal }) {
  // Using .* or .*$ at the end of a RegExp is useless
  // MongoDB documentation also warns against it as a performance optimization
  const opValA = opVal
    .replace(/\.\*$/, '')
    .replace(/\.\*\$$/, '');

  return new RegExp(opValA);
};

const regExpParserHandler = function (_, { opVal, throwErr }) {
  const message = `Invalid regular expression: '${opVal}'`;
  throwErr(message);
};

const eRegExpParser = addErrorHandler(regexParser, regExpParserHandler);

const arrayOpsParser = function ({
  opVal,
  attrName,
  attr: { type },
  throwErr,
}) {
  return parseAttributes({
    attrVal: opVal,
    attrName,
    attr: { type, isArray: false },
    throwErr,
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
