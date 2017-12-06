'use strict';

const { logPerfEvent } = require('../../perf');

// Event performance events related to the current request,
// e.g. how long each middleware lasted.
const perfEvent = function (
  { schema, mInput, respPerf },
  nextLayer,
  { measures },
) {
  const measuresA = [...measures, respPerf];
  return logPerfEvent({
    mInput,
    phase: 'request',
    measures: measuresA,
    schema,
  });
};

module.exports = {
  perfEvent,
};
