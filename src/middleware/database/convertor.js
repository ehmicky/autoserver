'use strict';


// Converts from Command format to Database format
const databaseConvertor = function () {
  return async function databaseConvertor(input) {
    const { command, args, modelName, jsl, log, params } = input;
    const perf = log.perf.start('database.convertor', 'middleware');

    const nextInput = { command, args, modelName, jsl, log, params };

    perf.stop();
    const response = await this.next(nextInput);
    return response;
  };
};


module.exports = {
  databaseConvertor,
};
