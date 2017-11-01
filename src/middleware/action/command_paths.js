'use strict';

const { assignArray } = require('../../utilities');

// Merge each action `commandPath` into a comma-separated list
const mergeCommandPaths = function ({ actions }) {
  return actions
    .map(({ commandPath }) => commandPath.join('.'))
    .reduce(assignArray, [])
    .join(', ');
};

module.exports = {
  mergeCommandPaths,
};
