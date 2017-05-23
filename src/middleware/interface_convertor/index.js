'use strict';


const { cloneDeep } = require('lodash');


// Converts from Protocol format to Interface format
const interfaceConvertor = function () {
  return async function interfaceConvertor(input) {
    const { method, params, payload, route, jsl } = input;

    const interf = cloneDeep({ method, params, payload, route });

    const response = await this.next({ interf, jsl });
    return response;
  };
};


module.exports = {
  interfaceConvertor,
};
