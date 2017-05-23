'use strict';


// Converts from Action format to Command format
const commandConvertor = function () {
  return async function commandConvertor(input) {
    const {
      command,
      args,
      sysArgs,
      modelName,
      jsl,
      interf,
    } = input;

    const newJsl = jsl.add({ COMMAND: command.type });

    const nextInput = {
      command,
      args,
      sysArgs,
      modelName,
      jsl: newJsl,
      interf,
    };

    const response = await this.next(nextInput);
    return response;
  };
};


module.exports = {
  commandConvertor,
};
