'use strict';

// Merge each action `commandpath` into a comma-separated list
const mergeCommandpaths = function ({ actions }) {
  return actions
    .map(({ commandpath }) => commandpath.join('.'))
    .join(', ');
};

module.exports = {
  mergeCommandpaths,
};
