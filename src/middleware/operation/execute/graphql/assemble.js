'use strict';

const { set } = require('../../../../utilities');

// Merge all actions into a single nested object
const assembleActions = function ({ actions }) {
  return actions.reduce(assembleAction, {});
};

const assembleAction = function (responseData, { response, respPaths }) {
  return respPaths.reduce(
    (responseDataA, respPath) =>
      assembleModel({ responseData: responseDataA, response, respPath }),
    responseData,
  );
};

const assembleModel = function ({
  responseData,
  response,
  respPath: { id, path },
}) {
  const model = response.find(modelA => modelA.id === id);
  return set(responseData, path, model);
};

module.exports = {
  assembleActions,
};
