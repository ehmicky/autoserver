'use strict';

const { fireAction } = require('./execute');
const actions = require('./actions');

// Translates operation-specific calls into generic instance actions
const actionExecute = async function (input) {
  const action = actions[input.action.type];
  const nextFunc = this.next.bind(this);
  const response = await fireAction({ input, action, nextFunc });
  return response;
};

module.exports = {
  actionExecute,
};
