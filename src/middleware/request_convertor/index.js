'use strict';


// Converts from API format to request format
const requestConvertor = async function () {
  return async function requestConvertor(input) {
    const {
      action,
      actionType,
      args,
      sysArgs,
      modelName,
      info,
      params,
    } = input;
    const nextInput = {
      action,
      actionType,
      args,
      sysArgs,
      modelName,
      info,
      params,
    };

    const response = await this.next(nextInput);
    return response;
  };
};


module.exports = {
  requestConvertor,
};
