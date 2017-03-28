'use strict';


const interfaceConvertor = async function () {
  return async function (input) {
    const { operation, route, params, payload } = input;
    const output = { operation, route, params, payload };
    const response = await this.next(output);
    return response;
  };
};


module.exports = {
  interfaceConvertor,
};