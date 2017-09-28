'use strict';

const { uniq } = require('lodash');

const getModelsCount = function ({ responses }) {
  const modelsCount = responses.length;
  const uniqueModelsCount = getUniqueModelsCount({ responses });

  return { modelsCount, uniqueModelsCount };
};

const getUniqueModelsCount = function ({ responses }) {
  const keys = responses
    .map(({ modelName, model: { id } }) => `${modelName} ${id}`);
  const keysA = uniq(keys);
  return keysA.length;
};

module.exports = {
  getModelsCount,
};
