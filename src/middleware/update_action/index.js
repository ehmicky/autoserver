'use strict';


const { pick, cloneDeep } = require('lodash');


/**
 *
 **/
const updateAction = async function () {
  return async function updateAction(input) {
    const { actionType } = input;

    if (actionType === 'update') {
      input = await performUpdate.call(this, input);
    }
    const response = await this.next(input);
    return response;
  };
};

const performUpdate = async function (input) {
  // TODO: validate args.data, i.e. that it is present
  const { args: { data } } = input;

  const findInput = getFindInput(input);
  const { data: models } = await this.next(findInput);
  let newData;
  if (models instanceof Array) {
    newData = models.map(model => Object.assign({}, model, data));
  } else {
    newData = Object.assign({}, models, data);
  }
  //input.args.data = newData;

  return input;
};

const getFindInput = function (input) {
  input = cloneDeep(input);
  const findInput = findInputMap[input.action];
  const actionType = findInput.actionType;
  const info = Object.assign({}, input.info, { actionType });
  const action = findInput.action;
  const args = findInput.args({ args: input.args });
  // Disables pagination
  const maxPageSize = 0;
  Object.assign(input, { actionType, info, action, args, maxPageSize });
  return input;
};

const getFindArgs = function ({ args }) {
  return pick(args, ['filter', 'order_by']);
};

const findInputMap = {
  updateOne: {
    args: getFindArgs,
    action: 'findOne',
    actionType: 'find',
  },
  updateMany: {
    args: getFindArgs,
    action: 'findMany',
    actionType: 'find',
  },
};


module.exports = {
  updateAction,
};
