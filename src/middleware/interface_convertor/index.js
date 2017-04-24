'use strict';


const interfaceConvertor = async function () {
  return async function (input) {
    const { method, route, params, payload, info } = input;
    const response = await this.next({ method, route, params, payload, info });
    return response;
  };
};


module.exports = {
  interfaceConvertor,
};
