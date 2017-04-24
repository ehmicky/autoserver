'use strict';


const apiConvertor = async function () {
  return async function (input) {
    const { api: { action, args, modelName }, info, params } = input;
    const response = await this.next({ action, args, modelName, info, params });
    return response;
  };
};


module.exports = {
  apiConvertor,
};
