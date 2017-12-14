'use strict';

const { sortArray, compareArrays } = require('../../utilities');

const sorter = function (obj, key, pathKey) {
  const val = sortArray(obj[key], sortTwo.bind(null, pathKey));
  return { [key]: val };
};

const sortTwo = function (pathKey, objA, objB) {
  return compareArrays(objA[pathKey], objB[pathKey]);
};

// Sort `actions` so that top-level ones are fired first
const sortActions = obj => sorter(obj, 'actions', 'commandpath');

// Sort `results` so that top-level ones are processed first
const sortResults = obj => sorter(obj, 'results', 'path');

module.exports = {
  sortActions,
  sortResults,
};
