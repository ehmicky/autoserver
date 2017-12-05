'use strict';

const { logEvent } = require('../log');

const { groupMeasures } = require('./group');
const { stringifyMeasures } = require('./stringify');

// Emit 'perf' event
const logPerfEvent = function ({ phase, measures, ...rest }) {
  const measuresGroups = groupMeasures({ measures });
  const measuresmessage = stringifyMeasures({ phase, measuresGroups });
  const vars = { measures: measuresGroups, measuresmessage };
  return logEvent({ ...rest, event: 'perf', phase, vars });
};

module.exports = {
  logPerfEvent,
};
