'use strict';

const { set } = require('../../../utilities');

// Merge all responses into a single nested object
const assembleResponses = function ({ responses }) {
  return responses.reduce(assembleResponse, {});
};

const assembleResponse = function (fullResponse, { model, path }) {
  return set(fullResponse, path, model);
};

module.exports = {
  assembleResponses,
};
