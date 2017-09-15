'use strict';

const { set } = require('../../../../utilities');

// Merge all actions into a single nested object
const assembleActions = function ({ actions }) {
  return actions.reduce(
    (responseA, { response, respPaths }) => {
      return respPaths.reduce(
        (responseB, respPath, index) => {
          return set(responseB, respPath, response[index]);
        },
        responseA,
      );
    },
    {},
  );
};

module.exports = {
  assembleActions,
};
