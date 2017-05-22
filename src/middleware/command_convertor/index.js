'use strict';


// Converts from Action format to Command format
const commandConvertor = function () {
  return async function commandConvertor(input) {
    const {
      command,
      args,
      sysArgs,
      modelName,
      jslInput,
      info,
      interf,
      protocol,
    } = input;

    const newInfo = Object.assign({}, info, { command });

    jslInput.$COMMAND = command.type;

    const nextInput = {
      command,
      args,
      sysArgs,
      modelName,
      jslInput,
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
