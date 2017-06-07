'use strict';


// Converts from Action format to Command format
const commandConvertor = function () {
  return async function commandConvertor(input) {
    const { command, args, sysArgs, modelName, jsl, log, params } = input;
    const perf = log.perf.start('commandConvertor', 'middleware');

    const newJsl = jsl.add({ $COMMAND: command.type });

    const nextInput = {
      command,
      args,
      sysArgs,
      modelName,
      jsl: newJsl,
      log,
      params,
    };

    let response;

    try {
      perf.stop();
      response = await this.next(nextInput);
    } catch (error) {
      const perf = log.perf.start('commandConvertor', 'exception');

      // Added only for final error handler
      log.add({ command });

      perf.stop();
      throw error;
    }

    return response;
  };
};


module.exports = {
  commandConvertor,
};
