'use strict';


const { actions } = require('../../idl');


const apiConvertor = async function () {
  return async function (input) {
    const { api: { action, args, modelName }, info, params } = input;
    const actionType = (actions.find(({ name }) => name === action) || {}).actionType;
    info.actionType = actionType;
    const response = await this.next({ action, actionType, args, modelName, info, params });
    return response;
  };
};


module.exports = {
  apiConvertor,
};
