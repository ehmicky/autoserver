'use strict';

const { assignArray } = require('../../utilities');

// Retrieve `currentData`, so it is passed to command middleware
// Note that `create` command does not have any `currentData`.
const getCurrentData = function ({ actions, ids }) {
  const currentData = actions
    .map(action => action.currentData)
    .reduce(assignArray, []);
  // Keep the same order as `newData` or `args.filter.id`
  const currentDataA = ids.map(id => findCurrentData({ id, currentData }));
  return currentDataA;
};

const findCurrentData = function ({ id, currentData }) {
  return currentData
    .find(currentDatum => currentDatum && currentDatum.id === id);
};

module.exports = {
  getCurrentData,
};
