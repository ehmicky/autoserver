'use strict';

const { throwError } = require('../../../../error');

const { validateMissingIds } = require('./missing_id');

const findIndexes = function ({ collection, filter }) {
  const indexes = searchIndexes({ collection, filter });

  validateMissingIds({ indexes, collection, filter });

  return indexes;
};

const searchIndexes = function ({ collection, filter }) {
  return Object.entries(collection)
    .filter(([, model]) => modelMatchFilters({ model, filters: filter }))
    .map(([index]) => index);
};

// Check if a model matches a query filter
const modelMatchFilters = function ({ model, filters }) {
  if (Array.isArray(filters)) {
    return filters.some(filter => modelMatchFilter({ model, filter }));
  }

  return modelMatchFilter({ model, filter: filters });
};

const modelMatchFilter = function ({ model, filter }) {
  return Object.entries(filter)
    .every(([attrName, attrs]) => modelMatchAttrs({ model, attrName, attrs }));
};

const modelMatchAttrs = function ({ model, attrName, attrs }) {
  if (Array.isArray(attrs)) {
    return attrs.some(attr => modelMatchAttr({ model, attrName, attr }));
  }

  return modelMatchAttr({ model, attrName, attr: attrs });
};

const modelMatchAttr = function ({ model, attrName, attr }) {
  // Shortcut for 'eq' matcher
  if (!attr || typeof attr !== 'object') {
    return modelMatchAttr({ model, attrName, attr: { eq: attr } });
  }

  const modelVal = model[attrName];

  return Object.entries(attr)
    .every(([matcherName, attrVal]) =>
      singleModelMatch({ matcherName, modelVal, attrVal }));
};

const singleModelMatch = function ({ matcherName, modelVal, attrVal }) {
  const matcher = matchers[matcherName];

  if (!matcher) {
    const message = `Filter keyword '${matcherName}' does not exist. Available ones are: ${Object.keys(matchers).join(', ')}`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return matcher({ modelVal, attrVal });
};

const eqMatcher = ({ modelVal, attrVal }) => modelVal === attrVal;

const neMatcher = ({ modelVal, attrVal }) => modelVal !== attrVal;

const gtMatcher = ({ modelVal, attrVal }) => modelVal > attrVal;

const geMatcher = ({ modelVal, attrVal }) => modelVal >= attrVal;

const ltMatcher = ({ modelVal, attrVal }) => modelVal < attrVal;

const leMatcher = ({ modelVal, attrVal }) => modelVal <= attrVal;

const matchers = {
  eq: eqMatcher,
  ne: neMatcher,
  gt: gtMatcher,
  ge: geMatcher,
  lt: ltMatcher,
  le: leMatcher,
};

module.exports = {
  findIndexes,
  searchIndexes,
};
