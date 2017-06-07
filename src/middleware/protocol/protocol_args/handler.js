'use strict';


const { map } = require('../../../utilities');
const { genericFillProtocolArgs } = require('./generic');
const { httpFillProtocolArgs } = require('./http');


// Transform headers into protocolArgs
const fillProtocolArgs = function (opts) {
  const perf = opts.startupLog.perf.start('protocolArgs', 'middleware');
  const argsMap = map(protocolArgsMap, func => func(opts));
  const getGenericProcotolArgs = genericFillProtocolArgs(opts);
  perf.stop();

  return async function fillProtocolArgs(input) {
    const { protocol, log } = input;

    const nonSpecificArgs = getGenericProcotolArgs(input);
    const specificArgs = argsMap[protocol](input);

    const protocolArgs = Object.assign({}, nonSpecificArgs, specificArgs);
    log.add({ protocolArgs });
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
