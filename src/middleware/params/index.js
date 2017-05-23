'use strict';


const { mapAsync } = require('../../utilities');
const { httpFillParams } = require('./http');


// Fill in request parameters: method, params, payload
const fillParams = async function (opts) {
  const map = await mapAsync(paramsMap, async func => await func(opts));

  return async function fillParams(input) {
    const { protocol, jsl } = input;

    const { method, params, payload } = await map[protocol.name](input);
    Object.assign(protocol, { method, params, payload });
    jsl.add({ PARAMS: params });

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
