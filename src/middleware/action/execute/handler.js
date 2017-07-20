'use strict';

const { fireAction } = require('./execute');
const actions = require('./actions');

// Translates operation-specific calls into generic instance actions
const actionExecute = async function (input) {
  const action = actions[input.action.type];
  const response = await fireAction.call(this, { input, action });
  return response;
};

module.exports = {
  actionExecute,
};
