'use strict';

const { set } = require('../../../../utilities');

// Merge all actions into a single nested object
const assembleActions = function ({ actions }) {
  return actions.reduce(
    (response, { data, actionPath }) => set(response, actionPath, data),
    {},
  );
};

module.exports = {
  assembleActions,
};
