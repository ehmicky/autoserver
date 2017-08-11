'use strict';

const { groupMeasures, stringifyMeasures } = require('../perf');

const { reportLog } = require('./report');

const reportPerf = async function ({ log, log: { phase }, measures }) {
  const measuresGroups = groupMeasures({ measures });
  const measuresMessage = stringifyMeasures({ phase, measuresGroups });
  const info = { measures: measuresGroups, measuresMessage };
  await reportLog({ log, type: 'perf', info });
};

module.exports = {
  reportPerf,
};
