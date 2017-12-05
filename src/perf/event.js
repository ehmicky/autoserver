'use strict';

const { emitEvent } = require('../events');

const { groupMeasures } = require('./group');
const { stringifyMeasures } = require('./stringify');

// Emit 'perf' event
const emitPerfEvent = async function ({ phase, measures, ...rest }) {
  const measuresGroups = groupMeasures({ measures });
  const measuresmessage = stringifyMeasures({ phase, measuresGroups });
  const vars = { measures: measuresGroups, measuresmessage };
  await emitEvent({ ...rest, type: 'perf', phase, vars });
};

module.exports = {
  emitPerfEvent,
};
