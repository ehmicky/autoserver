'use strict';

const { uniq } = require('lodash');

// Add `modelsCount` and `uniqueModelsCount`, using `results`.
// `modelsCount` is the number of models in the response
// `uniqueModelsCount` is the same, without the duplicates
const getModelsCount = function ({ results }) {
  const modelsCount = results.length;
  const uniqueModelsCount = getUniqueModelsCount({ results });

  return { modelsCount, uniqueModelsCount };
};

const getUniqueModelsCount = function ({ results }) {
  const keys = results
    .map(({ modelName, model: { id } }) => `${modelName} ${id}`);
  const keysA = uniq(keys);
  return keysA.length;
};

module.exports = {
  getModelsCount,
};
