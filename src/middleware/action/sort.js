'use strict';

const { sortArray } = require('../../utilities');

const sorter = function (key, pathKey, obj) {
  const val = sortArray(obj[key], sortTwo.bind(null, pathKey));
  return { [key]: val };
};

const sortTwo = function (pathKey, objA, objB) {
  return objA[pathKey].join('.') > objB[pathKey].join('.') ? 1 : -1;
};

// Sort actions so that top-level ones are fired first
const sortActions = sorter.bind(null, 'actions', 'commandPath');

// Sort results so that top-level ones are processed first
const sortResults = sorter.bind(null, 'results', 'path');

module.exports = {
  sortActions,
  sortResults,
};
