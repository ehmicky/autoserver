'use strict';

const { isEqual } = require('lodash');

// Check if a model matches a query filter
const modelMatchFilter = function ({
  model,
  filter: { type, attrName, value } = {},
}) {
  // E.g. when there is no `args.filter`
  if (type === undefined) { return true; }

  return matchers[type]({ model, attrName, value });
};

// Top-level array
const orMatcher = function ({ model, value }) {
  return value.some(filter => modelMatchFilter({ model, filter }));
};

// Several fields inside a filter object
const andMatcher = function ({ model, value }) {
  return value.every(filter => modelMatchFilter({ model, filter }));
};

// `{ array_attribute: { some: { ...} } }`
const someMatcher = function ({ model, attrName, value }) {
  const attr = model[attrName];
  return Object.keys(attr).some(index => arrayMatcher({ attr, index, value }));
};

// `{ array_attribute: { all: { ...} } }`
const allMatcher = function ({ model, attrName, value }) {
  const attr = model[attrName];
  return Object.keys(attr).every(index => arrayMatcher({ attr, index, value }));
};

const arrayMatcher = function ({ attr, index, value }) {
  const valueA = value.map(val => ({ ...val, attrName: index }));
  return andMatcher({ model: attr, value: valueA });
};

// `{ attribute: { eq: value } }` or `{ attribute: value }`
const eqMatcher = function ({ model, attrName, value }) {
  return isEqual(model[attrName], value);
};

// `{ attribute: { neq: value } }`
const neqMatcher = function ({ model, attrName, value }) {
  return !isEqual(model[attrName], value);
};

// `{ attribute: { in: [...] } }`
const inMatcher = function ({ model, attrName, value }) {
  return value.includes(model[attrName]);
};

// `{ attribute: { nin: [...] } }`
const ninMatcher = function ({ model, attrName, value }) {
  return !value.includes(model[attrName]);
};

// `{ attribute: { gt: value } }`
const gtMatcher = function ({ model, attrName, value }) {
  return model[attrName] > value;
};

// `{ attribute: { gte: value } }`
const gteMatcher = function ({ model, attrName, value }) {
  return model[attrName] >= value;
};

// `{ attribute: { lt: value } }`
const ltMatcher = function ({ model, attrName, value }) {
  return model[attrName] < value;
};

// `{ attribute: { lte: value } }`
const lteMatcher = function ({ model, attrName, value }) {
  return model[attrName] <= value;
};

// `{ string_attribute: { like: 'REGEXP' } }`
const likeMatcher = function ({ model, attrName, value }) {
  return value.test(model[attrName]);
};

// `{ string_attribute: { nlike: 'REGEXP' } }`
const nlikeMatcher = function ({ model, attrName, value }) {
  return !value.test(model[attrName]);
};

const matchers = {
  or: orMatcher,
  and: andMatcher,
  some: someMatcher,
  all: allMatcher,
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

module.exports = {
  modelMatchFilter,
};
