'use strict';

const { assignArray } = require('../../../../utilities');
const { throwError } = require('../../../../error');

// Transform results to normalized format
const getResults = function ({ actions, results, ids, modelName }) {
  validateResult({ ids, results });

  return actions
    .map(action => getModels({ action, results, modelName }))
    .reduce(assignArray, []);
};

const getModels = function ({
  results,
  modelName,
  action: { args, currentData, dataPaths, select },
}) {
  // `results` should be in same order as `args.data` or
  // (for `delete`) as `currentData`, and reuse their `dataPaths`
  const models = args.data || currentData;
  return models
    .map(findModel.bind(null, { results, dataPaths, select, modelName }))
    .filter(({ path }) => path !== undefined);
};

const findModel = function (
  { results, dataPaths, select, modelName },
  { id },
  index,
) {
  const model = results.find(result => result.id === id);
  const path = dataPaths[index];
  return { path, model, modelName, select };
};

// Safety check to make sure there is no server-side bugs
const validateResult = function ({ ids, results }) {
  const sameLength = results.length === ids.length;
  if (sameLength) { return; }

  const message = `'ids' and 'results' do not have the same length`;
  throwError(message, { reason: 'UTILITY_ERROR' });
};

module.exports = {
  getResults,
};
