'use strict';

const { removeDuplicates } = require('./duplicate');

// Merge all `args.data` into `newData`, for `replace|patch|create` commands
const mergeDataArgs = function ({ actions }) {
  const newData = actions.map(({ args: { data } }) => data);

  const newDataA = removeDuplicates(newData);

  return { newData: newDataA };
};

// Merge all `currentData` into `filter.id`, for `delete` command
const mergeDeleteArgs = function ({ actions }) {
  const models = actions.map(({ currentData }) => currentData);

  const modelsA = removeDuplicates(models);
  const deletedIds = modelsA.map(({ id }) => id);

  return { deletedIds };
};

const getDeletedIds = function ({ args: { deletedIds } }) {
  return deletedIds;
};

const getDataIds = function ({ args: { newData } }) {
  return newData.map(({ id }) => id);
};

const createHandler = { mergeArgs: mergeDataArgs, getIds: getDataIds };
const dataHandler = { mergeArgs: mergeDataArgs, getIds: getDataIds };
const filterHandler = { mergeArgs: mergeDeleteArgs, getIds: getDeletedIds };

// Each command has specific logic
const handlers = {
  create: createHandler,
  patch: dataHandler,
  replace: dataHandler,
  delete: filterHandler,
};

module.exports = {
  handlers,
};
