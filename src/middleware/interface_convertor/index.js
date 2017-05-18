'use strict';


const { cloneDeep } = require('lodash');


const interfaceConvertor = function () {
  return async function interfaceConvertor(input) {
    const { info, protocol } = input;
    const { method, params, payload, route } = protocol;

    const interf = cloneDeep({ method, params, payload, route });

    const response = await this.next({ info, protocol, interf });
    return response;
  };
};


module.exports = {
  interfaceConvertor,
};
