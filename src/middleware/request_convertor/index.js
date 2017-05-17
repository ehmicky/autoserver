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

    info.action = action.replace('find', 'read');
    info.dbCall = action.replace('find', 'read');
    const dbCallFull = action.replace('find', 'read');
    const dbCall = actionType.replace('find', 'read');

    const nextInput = {
      action,
      actionType,
      dbCallFull,
      dbCall,
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
