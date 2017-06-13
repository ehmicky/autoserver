'use strict';


// Converts from Action format to Command format
const commandConvertor = function () {
  return async function commandConvertor(input) {
    const { command, args, modelName, jsl, log, params, settings } = input;
    const perf = log.perf.start('command.convertor', 'middleware');

    const newJsl = jsl.add({ $COMMAND: command.type });

    const nextInput = {
      command,
      args,
      modelName,
      jsl: newJsl,
      log,
      params,
      settings,
    };

    let response;

    try {
      perf.stop();
      response = await this.next(nextInput);
    } catch (error) {
      const perf = log.perf.start('command.convertor', 'exception');

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
