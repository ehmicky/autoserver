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

    info.action = action;
    info.dbAction = action;
    const dbFullAction = action;
    const dbAction = actionType;

    const nextInput = {
      action,
      actionType,
      dbFullAction,
      dbAction,
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
