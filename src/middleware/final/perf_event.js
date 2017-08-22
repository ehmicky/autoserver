'use strict';

const { emitPerfEvent } = require('../../perf');

const perfEvent = async function (input) {
  // Do not report if exception was thrown
  if (input.error) { return input; }

  return input;

  // Total request time, stopped just before the response is sent
  const { reqInfo, response: { respPerf, measures }, runOpts } = input;
  const measuresA = [respPerf, ...measures];
  await emitPerfEvent({
    reqInfo,
    phase: 'request',
    measures: measuresA,
    runOpts,
  });

  return input;
};

module.exports = {
  perfEvent,
};
