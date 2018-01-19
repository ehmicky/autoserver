'use strict';

const pluralize = require('pluralize');

const { getWordsList } = require('../../utilities');

// Try to make error messages start the same way when referring to models
const getModels = function ({ ids, op = 'and', collection } = {}) {
  if (collection === undefined) {
    return 'Those models';
  }

  if (ids === undefined) {
    return `Those '${collection}' models`;
  }

  const idsA = getWordsList(ids, { op, quotes: true });
  const models = `The '${collection}' ${pluralize('model', ids.length)} with 'id' ${idsA}`;
  return models;
};

// Add prefix common to all adapter-related errors
const getAdapterMessage = function ({ adapter }) {
  if (adapter === undefined) { return; }

  return `In the adapter '${adapter}'`;
};

module.exports = {
  getModels,
  getAdapterMessage,
};
