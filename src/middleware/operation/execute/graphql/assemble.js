'use strict';

const { set, assignObject, mapValues } = require('../../../../utilities');

// Merge all actions into a single nested object
const assembleActions = function ({ actions }) {
  return actions.reduce(assembleAction, {});
};

const assembleAction = function (
  fullResponse,
  { response, respPaths, select },
) {
  return respPaths.reduce(
    (fullResponseA, { id, path }) => assembleModel({
      response,
      fullResponse: fullResponseA,
      select,
      id,
      path,
    }),
    fullResponse,
  );
};

const assembleModel = function ({ response, fullResponse, select, id, path }) {
  const model = response.find(modelA => modelA.id === id);
  const modelB = selectFields({ model, select });
  return set(fullResponse, path, modelB);
};

// Only output the fields that were picked by the client
// Also rename fields if the output key is different from the database one,
// e.g. using GraphQL "aliases"
const selectFields = function ({ model, select }) {
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
  assembleActions,
};
