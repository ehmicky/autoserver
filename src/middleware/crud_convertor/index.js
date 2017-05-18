'use strict';


// Converts from API format to CRUD format
const crudConvertor = function () {
  return async function crudConvertor(input) {
    const {
      command,
      args,
      sysArgs,
      modelName,
      info,
      params,
      protocol,
    } = input;

    const newInfo = Object.assign({}, info, { command });

    const nextInput = {
      command,
      args,
      sysArgs,
      modelName,
      info: newInfo,
      params,
      protocol,
    };

    const response = await this.next(nextInput);
    return response;
  };
};


module.exports = {
  crudConvertor,
};
