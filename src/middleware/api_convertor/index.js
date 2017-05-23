'use strict';


const { pick } = require('lodash');


// Converts from Command format to Api format
const apiConvertor = function () {
  return async function apiConvertor(input) {
    const { command, args, sysArgs, modelName, jsl } = input;

    const dbArgs = pick(args, [
      'data',
      'filter',
      'order_by',
      'dry_run',
      'no_output',
    ]);
    const nextInput = { command, args, dbArgs, sysArgs, modelName, jsl };

    const response = await this.next(nextInput);
    return response;
  };
};


module.exports = {
  apiConvertor,
};
