'use strict';

const { isEqual } = require('lodash');

const removeDuplicateResponses = function ({ responses }) {
  return responses.filter(isUniqueResponse);
};

const isUniqueResponse = function (response, index, responses) {
  return responses
    .slice(index + 1)
    .every(({ path }) => !isEqual(path, response.path));
};

module.exports = {
  removeDuplicateResponses,
};
