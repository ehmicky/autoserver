'use strict';

const { emitPerfEvent } = require('../../perf');

const perfEvent = async function (nextFunc, input) {
  const inputA = await nextFunc(input);

  // Total request time, stopped just before the response is sent
  // Do not report if exception was thrown
  const { reqInfo, response: { respPerf, measures }, runOpts } = inputA;
  const measuresA = [respPerf, ...measures];
  await emitPerfEvent({
    reqInfo,
    phase: 'request',
    measures: measuresA,
    runOpts,
  });

  return inputA;
};

module.exports = {
  perfEvent,
};
