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
      logInfo,
    } = input;

    const newInput = {
      method,
      queryVars,
      pathVars,
      protocolArgs,
      params,
      payload,
      route,
      jsl,
      logInfo,
    };

    const response = await this.next(newInput);
    return response;
  };
};


module.exports = {
  interfaceConvertor,
};
