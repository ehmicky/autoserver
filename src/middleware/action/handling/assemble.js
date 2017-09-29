'use strict';

const { set } = require('../../../utilities');

// Merge all results into a single nested response
const assembleResults = function ({ results }) {
  return results.reduce(assembleResult, {});
};

const assembleResult = function (response, { model, path }) {
  return set(response, path, model);
};

module.exports = {
  assembleResults,
};
