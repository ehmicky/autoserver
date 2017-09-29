'use strict';

const { sortArray } = require('../../../utilities');

const sortResults = function ({ results }) {
  return sortArray(results, sortTwoResults);
};

const sortTwoResults = function ({ path: pathA }, { path: pathB }) {
  return pathA.join('.') > pathB.join('.') ? 1 : -1;
};

module.exports = {
  sortResults,
};
