'use strict';

const { groupMeasures, stringifyMeasures } = require('../perf');

const { logEvent } = require('./main');

// Emit 'perf' event
const logPerfEvent = function ({ phase, measures, ...rest }) {
  const measuresGroups = groupMeasures({ measures });
  const measuresmessage = stringifyMeasures({ phase, measuresGroups });
  const params = { measures: measuresGroups, measuresmessage };
  return logEvent({ ...rest, event: 'perf', phase, params });
};

module.exports = {
  logPerfEvent,
};
