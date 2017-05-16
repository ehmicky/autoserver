'use strict';


const requestConvertor = async function () {
  return async function requestConvertor(input) {
    const { action, actionType, args, modelName, info, params } = input;
    const nextInput = { action, actionType, args, modelName, info, params };

    const response = await this.next(nextInput);
    return response;
  };
};


module.exports = {
  requestConvertor,
};
