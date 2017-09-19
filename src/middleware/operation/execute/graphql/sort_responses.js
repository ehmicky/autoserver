'use strict';

const { sortArray } = require('../../../../utilities');

const sortResponses = function ({ responses }) {
  return sortArray(responses, sortTwoResponses);
};

const sortTwoResponses = function ({ path: pathA }, { path: pathB }) {
  return pathA.join('.') > pathB.join('.') ? 1 : -1;
};

module.exports = {
  sortResponses,
};
