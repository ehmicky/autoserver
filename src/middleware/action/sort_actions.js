'use strict';

const { sortArray } = require('../../utilities');

// Sort actions so that top-level ones are fired first
const sortActions = function ({ actions }) {
  const actionsA = sortArray(actions, sortTwoActions);
  return { actions: actionsA };
};

const sortTwoActions = function (
  { commandPath: pathA },
  { commandPath: pathB },
) {
  return pathA.join('.') > pathB.join('.') ? 1 : -1;
};

module.exports = {
  sortActions,
};
