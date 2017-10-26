'use strict';

const { isEqual } = require('lodash');

// `{ attribute: { eq: value } }` or `{ attribute: value }`
const eqMatcher = function ({ attr, value }) {
  return isEqual(attr, value);
};

// `{ attribute: { neq: value } }`
const neqMatcher = function ({ attr, value }) {
  return !isEqual(attr, value);
};

// `{ attribute: { in: [...] } }`
const inMatcher = function ({ attr, value }) {
  return value.includes(attr);
};

// `{ attribute: { nin: [...] } }`
const ninMatcher = function ({ attr, value }) {
  return !value.includes(attr);
};

// `{ attribute: { gt: value } }`
const gtMatcher = function ({ attr, value }) {
  return attr > value;
};

// `{ attribute: { gte: value } }`
const gteMatcher = function ({ attr, value }) {
  return attr >= value;
};

// `{ attribute: { lt: value } }`
const ltMatcher = function ({ attr, value }) {
  return attr < value;
};

// `{ attribute: { lte: value } }`
const lteMatcher = function ({ attr, value }) {
  return attr <= value;
};

// `{ string_attribute: { like: 'REGEXP' } }`
const likeMatcher = function ({ attr, value }) {
  const regExp = new RegExp(value);
  return regExp.test(attr);
};

// `{ string_attribute: { nlike: 'REGEXP' } }`
const nlikeMatcher = function ({ attr, value }) {
  const regExp = new RegExp(value);
  return !regExp.test(attr);
};

module.exports = {
  eq: eqMatcher,
  neq: neqMatcher,
  in: inMatcher,
  nin: ninMatcher,
  gt: gtMatcher,
  gte: gteMatcher,
  lt: ltMatcher,
  lte: lteMatcher,
  like: likeMatcher,
  nlike: nlikeMatcher,
};
