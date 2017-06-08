'use strict';


const { difference } = require('lodash');

const { actions: allActions } = require('../../constants');


// Retrieve possible actions using possible commandNames
const getActions = function ({ commandNames }) {
  return allActions
    .filter(({ commandNames: requiredCommands }) => {
      return difference(requiredCommands, commandNames).length === 0;
    })
    .map(({ name }) => name);
};


module.exports = {
  getActions,
};
