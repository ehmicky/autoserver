'use strict';

const { isEqual } = require('lodash');

// Read and write actions might have duplicate results, which we remove here
const removeDuplicateResults = function ({ results }) {
  const resultsA = results.filter(isUniqueResult);
  return { results: resultsA };
};

const isUniqueResult = function (result, index, results) {
  return results
    .slice(index + 1)
    .every(({ path }) => !isEqual(path, result.path));
};

module.exports = {
  removeDuplicateResults,
};
