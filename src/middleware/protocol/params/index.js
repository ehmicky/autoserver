'use strict';


const { map } = require('../../../utilities');
const { httpFillParams } = require('./http');


// Fill in request parameters: method, protocolMethod, params, payload
const fillParams = function (opts) {
  const pMap = map(paramsMap, func => func(opts));

  return async function fillParams(input) {
    const { jsl, protocol, log } = input;

    const {
      method,
      protocolMethod,
      queryVars,
      headers,
      params,
      payload,
    } = await pMap[protocol](input);

    const newJsl = jsl.add({ $PARAMS: params });

    log.add({
      method,
      protocolMethod,
      queryVars,
      headers,
      params,
      payload,
    });
    Object.assign(input, {
      method,
      protocolMethod,
      queryVars,
      headers,
      params,
      payload,
      jsl: newJsl,
    });

    const response = await this.next(input);
    return response;
  };
};

const paramsMap = {
  http: httpFillParams,
};


module.exports = {
  fillParams,
};
