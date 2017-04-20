'use strict';


const interfaceConvertor = async function () {
  return async function (input) {
    const { operation, route, params, payload, info } = input;
    const response = await this.next({ operation, route, params, payload, info });
    return response;
  };
};


module.exports = {
  interfaceConvertor,
};
