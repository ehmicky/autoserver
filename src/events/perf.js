'use strict';

const { groupMeasures, stringifyMeasures } = require('../perf');

const { emitEvent } = require('./report');

const reportPerf = async function ({ log, phase, measures, runtimeOpts }) {
  const measuresGroups = groupMeasures({ measures });
  const measuresMessage = stringifyMeasures({ phase, measuresGroups });
  const info = { measures: measuresGroups, measuresMessage };
  await emitEvent({ log, type: 'perf', phase, info, runtimeOpts });
};

module.exports = {
  reportPerf,
};
