'use strict';

const { addErrorHandler } = require('../../error');
const { throwAttrValError, throwAttrTypeError } = require('../error');

const { validateNotArrayOps } = require('./common');

const parseLikeNlike = function ({ value }) {
  // Using .* or .*$ at the end of a RegExp is useless
  // MongoDB documentation also warns against it as a performance optimization
  return value
    .replace(/\.\*$/, '')
    .replace(/\.\*\$$/, '');
};

const validateLikeNlike = function ({
  value,
  type,
  attr,
  attr: { type: attrType, isArray },
  throwErr,
}) {
  validateNotArrayOps({ type, attr, throwErr });

  if (typeof value !== 'string') {
    throwAttrValError({ type, throwErr }, 'a string');
  }

  if (attrType !== 'string') {
    throwAttrTypeError({ attr, type, throwErr }, 'not a string');
  }

  if (isArray) {
    throwAttrTypeError({ attr, type, throwErr }, 'an array');
  }

  eValidateRegExp({ value, throwErr });
};

// Validate it is correct regexp
const validateRegExp = function ({ value }) {
  // eslint-disable-next-line no-new
  new RegExp(value, 'i');
};

const regExpParserHandler = function (_, { value, throwErr }) {
  const message = `Invalid regular expression: '${value}'`;
  throwErr(message);
};

const eValidateRegExp = addErrorHandler(validateRegExp, regExpParserHandler);

// `{ string_attribute: { like: 'REGEXP' } }`
const evalLike = function ({ attr, value }) {
  const regExp = new RegExp(value, 'i');
  return regExp.test(attr);
};

// `{ string_attribute: { nlike: 'REGEXP' } }`
const evalNlike = function ({ attr, value }) {
  const regExp = new RegExp(value, 'i');
  return !regExp.test(attr);
};

module.exports = {
  like: {
    parse: parseLikeNlike,
    validate: validateLikeNlike,
    eval: evalLike,
  },
  nlike: {
    parse: parseLikeNlike,
    validate: validateLikeNlike,
    eval: evalNlike,
  },
};
