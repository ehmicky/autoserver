'use strict';

const { fireAction } = require('./execute');
const actions = require('./actions');

// Translates operation-specific calls into generic instance actions
const actionExecute = function (input, nextLayer) {
  const action = actions[input.action.type];
  return fireAction({ input, action, nextLayer });
};

module.exports = {
  actionExecute,
};
