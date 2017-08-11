'use strict';

const { groupMeasures, stringifyMeasures } = require('../perf');

const { reportLog } = require('./report');

const reportPerf = async function ({ log, phase, measures, runtimeOpts }) {
  const measuresGroups = groupMeasures({ measures });
  const measuresMessage = stringifyMeasures({ phase, measuresGroups });
  const info = { measures: measuresGroups, measuresMessage };
  await reportLog({ log, type: 'perf', phase, info, runtimeOpts });
};

module.exports = {
  reportPerf,
};
