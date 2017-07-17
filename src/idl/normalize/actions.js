'use strict';

const { difference } = require('lodash');

const { ACTIONS } = require('../../constants');

// Retrieve possible actions using possible commandNames
const getActions = function ({ commandNames }) {
  return ACTIONS
    .filter(({ commandNames: requiredCommands }) => {
      return difference(requiredCommands, commandNames).length === 0;
    })
    .map(({ name }) => name);
};

module.exports = {
  getActions,
};
