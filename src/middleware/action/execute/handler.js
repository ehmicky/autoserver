'use strict';

const { fireAction } = require('./execute');
const actions = require('./actions');

// Translates operation-specific calls into generic instance actions
const actionExecute = function (mInput, nextLayer) {
  const action = actions[mInput.action.type];
  return fireAction({ mInput, action, nextLayer });
};

module.exports = {
  actionExecute,
};
