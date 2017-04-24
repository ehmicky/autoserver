'use strict';


const apiConvertor = async function () {
  return async function (input) {
    const { api: { action, args, modelName }, info } = input;
    const response = await this.next({ action, args, modelName, info });
    return response;
  };
};


module.exports = {
  apiConvertor,
};
