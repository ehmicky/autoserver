'use strict';

const { assignArray } = require('../../../../utilities');

const { removeDuplicates } = require('./duplicate');

// Merge all `args.data` into `newData`, for `replace|patch|create` commands
const mergeDataArgs = function ({ actions }) {
  const newData = actions.map(action => action.args.data);

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

// Retrieve `currentData`, so it is passed to command middleware
// Note that `create` command does not have any `currentData`.
const getCurrentData = function ({ actions, args, ids }) {
  const currentData = actions
    .map(action => action.currentData)
    .reduce(assignArray, []);
  // Keep the same order as `newData` or `args.filter.id`
  const currentDataA = ids.map(id => findCurrentData({ id, currentData }));

  return { ...args, currentData: currentDataA };
};

const findCurrentData = function ({ id, currentData }) {
  return currentData
    .find(currentDatum => currentDatum && currentDatum.id === id);
};

const createHandler = {
  mergeArgs: mergeDataArgs,
  getIds: getDataIds,
  getCurrentData: ({ args }) => args,
};
const dataHandler = {
  mergeArgs: mergeDataArgs,
  getIds: getDataIds,
  getCurrentData,
};
const filterHandler = {
  mergeArgs: mergeDeleteArgs,
  getIds: getDeletedIds,
  getCurrentData,
};

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
