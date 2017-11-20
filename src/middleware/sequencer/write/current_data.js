'use strict';

const { flatten } = require('../../../utilities');

// Retrieve `currentData`, so it is passed to command middleware
const getCurrentData = function ({ actions, ids }) {
  const currentData = actions.map(action => action.currentData);
  const currentDataA = flatten(currentData);
  // Keep the same order as `newData` or `args.filter.id`
  const currentDataB = ids
    .map(id => findCurrentData({ id, currentData: currentDataA }));
  return currentDataB;
};

const findCurrentData = function ({ id, currentData }) {
  return currentData
    .find(currentDatum => currentDatum && currentDatum.id === id);
};

module.exports = {
  getCurrentData,
};
