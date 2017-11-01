'use strict';

const { removeDuplicates } = require('./duplicate');

// Merge all `args.data` into `newData`, for `replace|patch|create` commands
const getNewData = function ({ actions }) {
  const models = actions.map(({ args: { data } }) => data);
  const modelsA = removeDuplicates(models);

  const ids = modelsA.map(({ id }) => id);

  return { args: { newData: modelsA }, ids };
};

// Merge all `currentData` into `filter.id`, for `delete` command
const getCurrentData = function ({ actions }) {
  const models = actions.map(({ currentData }) => currentData);
  const modelsA = removeDuplicates(models);

  const ids = modelsA.map(({ id }) => id);

  return { args: { deletedIds: ids }, ids };
};

// Each command has specific logic
const getArgs = {
  create: getNewData,
  patch: getNewData,
  replace: getNewData,
  delete: getCurrentData,
};

module.exports = {
  getArgs,
};
