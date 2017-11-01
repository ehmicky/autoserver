'use strict';

const { removeDuplicates } = require('./duplicate');

// Merge all `args.data` into `newData`, for `replace|patch|create` commands
const getNewData = function ({ actions }) {
  const models = getModels(actions, ({ args: { data } }) => data);

  const ids = models.map(({ id }) => id);

  return { args: { newData: models }, ids };
};

// Merge all `currentData` into `filter.id`, for `delete` command
const getCurrentData = function ({ actions }) {
  const models = getModels(actions, ({ currentData }) => currentData);

  const ids = models.map(({ id }) => id);

  return { args: { deletedIds: ids }, ids };
};

const getModels = function (actions, getModel) {
  const models = actions.map(getModel);
  const modelsA = removeDuplicates(models);
  return modelsA;
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
