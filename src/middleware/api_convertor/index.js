'use strict';


const { actions } = require('../../idl');


const apiConvertor = async function () {
  return async function (input) {
    const { api: { action, args, modelName }, info, params } = input;
    info.actionType = (actions.find(({ name }) => name === action) || {}).actionType;
    const response = await this.next({ action, args, modelName, info, params });
    return response;
  };
};


module.exports = {
  apiConvertor,
};
