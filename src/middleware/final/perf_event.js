'use strict';

const { logPerfEvent } = require('../../log');

// Event performance events related to the current request,
// e.g. how long each middleware lasted.
const perfEvent = function (
  { config, mInput, respPerf },
  nextLayer,
  { measures },
) {
  const measuresA = [...measures, respPerf];
  return logPerfEvent({
    mInput,
    phase: 'request',
    measures: measuresA,
    config,
  });
};

module.exports = {
  perfEvent,
};
