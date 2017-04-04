'use strict';


const apiConvertor = async function () {
  return async function (input) {
    const { api: { operation, args, modelName } } = input;
    const response = await this.next({ operation, args, modelName });
    return response;
  };
};


module.exports = {
  apiConvertor,
};
