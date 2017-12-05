'use strict';

const { emitEvent } = require('../events');

const { groupMeasures } = require('./group');
const { stringifyMeasures } = require('./stringify');

// Emit 'perf' event
const emitPerfEvent = function ({ phase, measures, ...rest }) {
  const measuresGroups = groupMeasures({ measures });
  const measuresmessage = stringifyMeasures({ phase, measuresGroups });
  const vars = { measures: measuresGroups, measuresmessage };
  return emitEvent({ ...rest, type: 'perf', phase, vars });
};

module.exports = {
  emitPerfEvent,
};
