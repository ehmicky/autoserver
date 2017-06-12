'use strict';


// Converts from Command format to Api format
const apiConvertor = function () {
  return async function apiConvertor(input) {
    const { command, args, modelName, jsl, log, params } = input;
    const perf = log.perf.start('api.convertor', 'middleware');

    const nextInput = { command, args, modelName, jsl, log, params };

    perf.stop();
    const response = await this.next(nextInput);
    return response;
  };
};


module.exports = {
  apiConvertor,
};
