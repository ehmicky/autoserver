'use strict';


const { cloneDeep } = require('lodash');


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
    } = input;

    const newInput = cloneDeep({
      method,
      queryVars,
      pathVars,
      protocolArgs,
      params,
      payload,
      route,
      jsl,
    });

    const response = await this.next(newInput);
    return response;
  };
};


module.exports = {
  interfaceConvertor,
};
