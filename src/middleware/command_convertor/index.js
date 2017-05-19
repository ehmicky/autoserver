'use strict';


// Converts from Action format to Command format
const commandConvertor = function () {
  return async function commandConvertor(input) {
    const {
      command,
      args,
      sysArgs,
      modelName,
      info,
      interf,
      protocol,
    } = input;

    const newInfo = Object.assign({}, info, { command });

    const nextInput = {
      command,
      args,
      sysArgs,
      modelName,
      info: newInfo,
      interf,
      protocol,
    };

    const response = await this.next(nextInput);
    return response;
  };
};


module.exports = {
  commandConvertor,
};
