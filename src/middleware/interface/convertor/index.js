'use strict';


// Converts from Protocol format to Interface format
const interfaceConvertor = function () {
  return async function interfaceConvertor(input) {
    const { method, params, payload, route, jsl } = input;

    const newInput = { method, params, payload, route, jsl };

    const response = await this.next(newInput);
    return response;
  };
};


module.exports = {
  interfaceConvertor,
};
