'use strict';

const { isEqual } = require('lodash');

const { validateMissingIds } = require('./missing_id');

// Check if a model matches a query filter
const modelMatchFilter = function ({
  model,
  collection,
  filter: { type, attrName, value } = {},
}) {
  // E.g. when there is no `args.filter`
  if (type === undefined) { return true; }

  validateMissingIds({ collection, type, attrName, value });

  return matchers[type]({ model, collection, attrName, value });
};

// Top-level array
const orMatcher = function ({ model, collection, value }) {
  return value.some(filter => modelMatchFilter({ model, collection, filter }));
};

// Several fields inside a filter object
const andMatcher = function ({ model, collection, value }) {
  return value.every(filter => modelMatchFilter({ model, collection, filter }));
};

// `{ array_attribute: { some: { ...} } }`
const someMatcher = function ({ model, attrName, collection, value }) {
  const attr = model[attrName];
  return Object.keys(attr)
    .some(index => arrayMatcher({ attr, index, collection, value }));
};

// `{ array_attribute: { all: { ...} } }`
const allMatcher = function ({ model, attrName, collection, value }) {
  const attr = model[attrName];
  return Object.keys(attr)
    .every(index => arrayMatcher({ attr, index, collection, value }));
};

const arrayMatcher = function ({ attr, index, collection, value }) {
  const valueA = value.map(val => ({ ...val, attrName: index }));
  return andMatcher({ model: attr, collection, value: valueA });
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

// `{ attribute: { ge: value } }`
const geMatcher = function ({ model, attrName, value }) {
  return model[attrName] >= value;
};

// `{ attribute: { lt: value } }`
const ltMatcher = function ({ model, attrName, value }) {
  return model[attrName] < value;
};

// `{ attribute: { le: value } }`
const leMatcher = function ({ model, attrName, value }) {
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
  ge: geMatcher,
  lt: ltMatcher,
  le: leMatcher,
  like: likeMatcher,
  nlike: nlikeMatcher,
};

module.exports = {
  modelMatchFilter,
};
