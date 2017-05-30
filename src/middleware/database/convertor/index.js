'use strict';


// Converts from Api format to Database format
const databaseConvertor = function () {
  return async function databaseConvertor(input) {
    const { command, dbArgs, sysArgs, modelName, jsl, logInfo, params } = input;
    const nextInput = {
      command,
      dbArgs,
      sysArgs,
      modelName,
      jsl,
      logInfo,
      params,
    };

    const response = await this.next(nextInput);
    return response;
  };
};


module.exports = {
  databaseConvertor,
};
