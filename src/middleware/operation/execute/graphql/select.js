'use strict';

const { get, set, assignObject, mapValues } = require('../../../../utilities');

// Only output the fields that were picked by the client
// Also rename fields if the output key is different from the database one,
// e.g. using GraphQL "aliases"
const selectFields = function ({ fullResponse, responses }) {
  // Need to recurse through children first
  return responses.reduceRight(selectFieldsByResponse, fullResponse);
};

const selectFieldsByResponse = function (fullResponse, { path, select }) {
  const model = get(fullResponse, path);
  const modelA = selectFieldsByModel({ model, select });
  return set(fullResponse, path, modelA);
};

const selectFieldsByModel = function ({ model, select }) {
  if (model == null) { return model; }

  // Make sure return value is sorted in the same order as `select`
  const modelA = select
    .map(({ dbKey, outputKey }) => ({ [outputKey]: model[dbKey] }))
    .reduce(assignObject, {});

  const modelB = mapValues(modelA, normalizeNull);

  return modelB;
};

// Transform `undefined` to `null`
const normalizeNull = function (value) {
  if (value !== undefined) { return value; }

  return null;
};

module.exports = {
  selectFields,
};
