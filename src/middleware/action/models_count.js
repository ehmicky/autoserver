'use strict';

const { uniq } = require('../../utilities');

// Add `modelsCount` and `uniqueModelsCount`, using `results`.
// `modelsCount` is the number of models in the response
// `uniqueModelsCount` is the same, without the duplicates
const getModelsCount = function ({ results }) {
  const modelsCount = results.length;
  const uniqueModelsCount = getUniqueModelsCount({ results });

  return { modelsCount, uniqueModelsCount };
};

const getUniqueModelsCount = function ({ results }) {
  const keys = uniq(results, getModelNameId);
  return keys.length;
};

const getModelNameId = function ({ modelName, model: { id } }) {
  return `${modelName} ${id}`;
};

module.exports = {
  getModelsCount,
};
