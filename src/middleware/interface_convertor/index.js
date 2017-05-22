'use strict';


const { cloneDeep } = require('lodash');


const interfaceConvertor = function () {
  return async function interfaceConvertor(input) {
    const { info, jslInput, protocol } = input;
    const { method, params, payload, route, ip, timestamp } = protocol;

    const interf = cloneDeep({ method, params, payload, route });

    jslInput.requestInput = { params, ip, timestamp };

    const response = await this.next({ info, protocol, interf, jslInput });
    return response;
  };
};


module.exports = {
  interfaceConvertor,
};
