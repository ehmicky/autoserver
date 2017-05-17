'use strict';


// Converts from API format to request format
const requestConvertor = async function () {
  return async function requestConvertor(input) {
    const {
      dbCallFull,
      dbCall,
      args,
      sysArgs,
      modelName,
      info,
      params,
    } = input;

    const newInfo = Object.assign({}, info, { dbCall, dbCallFull });

    const nextInput = {
      dbCallFull,
      dbCall,
      args,
      sysArgs,
      modelName,
      info: newInfo,
      params,
    };

    const response = await this.next(nextInput);
    return response;
  };
};


module.exports = {
  requestConvertor,
};
