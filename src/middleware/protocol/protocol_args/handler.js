'use strict';


const { map } = require('../../../utilities');
const { genericFillProtocolArgs } = require('./generic');
const { httpFillProtocolArgs } = require('./http');


// Transform headers into protocolArgs
const fillProtocolArgs = function (opts) {
  const { startupLog } = opts;
  const perf = startupLog.perf.start('protocol.protocolArgs', 'middleware');
  const argsMap = map(protocolArgsMap, func => func(opts));
  const getGenericProcotolArgs = genericFillProtocolArgs(opts);
  perf.stop();

  return async function fillProtocolArgs(input) {
    const { protocol, log } = input;
    const perf = log.perf.start('protocol.fillProtocolArgs', 'middleware');

    const nonSpecificArgs = getGenericProcotolArgs(input);
    const specificArgs = argsMap[protocol](input);

    const protocolArgs = Object.assign({}, nonSpecificArgs, specificArgs);
    log.add({ protocolArgs });
    Object.assign(input, { protocolArgs });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

const protocolArgsMap = {
  HTTP: httpFillProtocolArgs,
};


module.exports = {
  fillProtocolArgs,
};
