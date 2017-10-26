'use strict';

const { addErrorHandler } = require('../../../error');

const { throwAttrValError, throwAttrTypeError } = require('./error');
const { validateNotArrayOps } = require('./common');

const parseLikeNlike = function ({ opVal }) {
  // Using .* or .*$ at the end of a RegExp is useless
  // MongoDB documentation also warns against it as a performance optimization
  return opVal
    .replace(/\.\*$/, '')
    .replace(/\.\*\$$/, '');
};

const validateLikeNlike = function ({
  opVal,
  attrName,
  opName,
  attr,
  attr: { type, isArray },
  throwErr,
}) {
  validateNotArrayOps({ opName, attrName, attr, throwErr });

  if (typeof opVal !== 'string') {
    throwAttrValError({ attrName, opName, throwErr }, 'a string');
  }

  if (type !== 'string') {
    throwAttrTypeError({ attrName, attr, opName, throwErr }, 'not a string');
  }

  if (isArray) {
    throwAttrTypeError({ attrName, attr, opName, throwErr }, 'an array');
  }

  eValidateRegExp({ opVal, throwErr });
};

// Validate it is correct regexp
const validateRegExp = function ({ opVal }) {
  // eslint-disable-next-line no-new
  new RegExp(opVal);
};

const regExpParserHandler = function (_, { opVal, throwErr }) {
  const message = `Invalid regular expression: '${opVal}'`;
  throwErr(message);
};

const eValidateRegExp = addErrorHandler(validateRegExp, regExpParserHandler);

// `{ string_attribute: { like: 'REGEXP' } }`
const evalLike = function ({ attr, value }) {
  const regExp = new RegExp(value);
  return regExp.test(attr);
};

// `{ string_attribute: { nlike: 'REGEXP' } }`
const evalNlike = function ({ attr, value }) {
  const regExp = new RegExp(value);
  return !regExp.test(attr);
};

module.exports = {
  parseLikeNlike,
  validateLikeNlike,
  evalLike,
  evalNlike,
};
