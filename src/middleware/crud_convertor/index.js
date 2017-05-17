'use strict';


// Converts from API format to CRUD format
const crudConvertor = async function () {
  return async function crudConvertor(input) {
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
  crudConvertor,
};
