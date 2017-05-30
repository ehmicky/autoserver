'use strict';


// Converts from Action format to Command format
const commandConvertor = function () {
  return async function commandConvertor(input) {
    const { command, args, sysArgs, modelName, jsl, logInfo, params } = input;

    const newJsl = jsl.add({ $COMMAND: command.type });

    const nextInput = {
      command,
      args,
      sysArgs,
      modelName,
      jsl: newJsl,
      logInfo,
      params,
    };

    const response = await this.next(nextInput);
    return response;
  };
};


module.exports = {
  commandConvertor,
};
