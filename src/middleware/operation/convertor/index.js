'use strict';


// Converts from Protocol format to Operation format
const operationConvertor = function () {
  return async function operationConvertor(input) {
    const {
      goal,
      queryVars,
      pathVars,
      params,
      payload,
      route,
      jsl,
      log,
      args,
    } = input;
    const perf = log.perf.start('operation.convertor', 'middleware');

    const newInput = {
      goal,
      queryVars,
      pathVars,
      params,
      payload,
      route,
      jsl,
      log,
      args,
    };

    perf.stop();
    const response = await this.next(newInput);
    return response;
  };
};


module.exports = {
  operationConvertor,
};
