'use strict';


const interfaceConvertor = function () {
  return async function interfaceConvertor(input) {
    const { method, route, params, payload, info, protocol } = input;
    const response = await this.next({
      method,
      route,
      params,
      payload,
      info,
      protocol,
    });
    return response;
  };
};


module.exports = {
  interfaceConvertor,
};
