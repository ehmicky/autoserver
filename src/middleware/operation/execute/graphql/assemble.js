'use strict';

const { set } = require('../../../../utilities');

// Merge all actions into a single nested object
const assembleActions = function ({ actions }) {
  return actions.reduce(assembleAction, {});
};

const assembleAction = function (responseData, { responses }) {
  return responses.reduce(
    (responseDataA, response) =>
      assembleModel({ responseData: responseDataA, response }),
    responseData,
  );
};

const assembleModel = function ({ responseData, response: { model, path } }) {
  return set(responseData, path, model);
};

module.exports = {
  assembleActions,
};
