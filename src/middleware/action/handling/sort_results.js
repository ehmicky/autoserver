'use strict';

const { sortArray } = require('../../../utilities');

const sortResults = function ({ results }) {
  const resultsA = sortArray(results, sortTwoResults);
  return { results: resultsA };
};

const sortTwoResults = function ({ path: pathA }, { path: pathB }) {
  return pathA.join('.') > pathB.join('.') ? 1 : -1;
};

module.exports = {
  sortResults,
};
