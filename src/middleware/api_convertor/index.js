'use strict';


const apiConvertor = async function () {
  return async function (input) {
    const { api: { operation, args, modelName }, info } = input;
    const response = await this.next({ operation, args, modelName, info });
    return response;
  };
};


module.exports = {
  apiConvertor,
};
