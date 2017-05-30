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

    let response;

    try {
      response = await this.next(nextInput);
    } catch (error) {
      // Added only for final error handler
      logInfo.add({ command });
      throw error;
    }

    return response;
  };
};


module.exports = {
  commandConvertor,
};
