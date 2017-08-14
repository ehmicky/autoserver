'use strict';

const { emitEvent } = require('../events');

const { groupMeasures } = require('./group');
const { stringifyMeasures } = require('./stringify');

const emitPerfEvent = async function ({ log, phase, measures, runtimeOpts }) {
  const measuresGroups = groupMeasures({ measures });
  const measuresMessage = stringifyMeasures({ phase, measuresGroups });
  const info = { measures: measuresGroups, measuresMessage };
  await emitEvent({ log, type: 'perf', phase, info, runtimeOpts });
};

module.exports = {
  emitPerfEvent,
};
