'use strict';


// Converts from Protocol format to Interface format
const interfaceConvertor = function () {
  return async function interfaceConvertor(input) {
    const {
      method,
      queryVars,
      pathVars,
      protocolArgs,
      params,
      payload,
      route,
      jsl,
      log,
    } = input;
    const perf = log.perf.start('interfaceConvertor', 'middleware');

    const newInput = {
      method,
      queryVars,
      pathVars,
      protocolArgs,
      params,
      payload,
      route,
      jsl,
      log,
    };

    perf.stop();
    const response = await this.next(newInput);
    return response;
  };
};


module.exports = {
  interfaceConvertor,
};
