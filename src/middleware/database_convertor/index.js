'use strict';


// Converts from Api format to Database format
const databaseConvertor = function () {
  return async function apiConvertor(input) {
    const { command, dbArgs, sysArgs, modelName, jsl } = input;
    const nextInput = { command, dbArgs, sysArgs, modelName, jsl };

    const response = await this.next(nextInput);
    return response;
  };
};


module.exports = {
  databaseConvertor,
};
