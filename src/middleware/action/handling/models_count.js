'use strict';

const { uniq } = require('lodash');

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
