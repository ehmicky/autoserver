'use strict';

const { sortArray } = require('../../../../utilities');

const sortActions = function ({ actions }) {
  return sortArray(actions, sortTwoActions);
};

const sortTwoActions = function ({ actionPath: pathA }, { actionPath: pathB }) {
  return pathA.join('.') > pathB.join('.') ? 1 : -1;
};

module.exports = {
  sortActions,
};
