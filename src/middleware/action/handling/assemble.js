'use strict';

const { set } = require('../../../utilities');

// Merge all results into a single nested response
const assembleResults = function ({ results }) {
  return results.reduce(assembleResult, {});
};

const assembleResult = function (fullResponse, { model, path }) {
  return set(fullResponse, path, model);
};

module.exports = {
  assembleResults,
};
