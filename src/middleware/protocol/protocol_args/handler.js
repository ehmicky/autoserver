'use strict';


const { map } = require('../../../utilities');
const { genericFillProtocolArgs } = require('./generic');
const { httpFillProtocolArgs } = require('./http');


// Transform headers into protocolArgs
const fillProtocolArgs = function (opts) {
  const argsMap = map(protocolArgsMap, func => func(opts));
  const getGenericProcotolArgs = genericFillProtocolArgs(opts);

  return async function fillProtocolArgs(input) {
    const { protocol, logInfo } = input;

    const nonSpecificArgs = getGenericProcotolArgs(input);
    const specificArgs = argsMap[protocol](input);

    const protocolArgs = Object.assign({}, nonSpecificArgs, specificArgs);
    logInfo.add({ protocolArgs });
    Object.assign(input, { protocolArgs });

    const response = await this.next(input);
    return response;
  };
};

const protocolArgsMap = {
  http: httpFillProtocolArgs,
};


module.exports = {
  fillProtocolArgs,
};
