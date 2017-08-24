'use strict';

const { emitEvent } = require('../events');

const { groupMeasures } = require('./group');
const { stringifyMeasures } = require('./stringify');

// Emit 'perf' event
const emitPerfEvent = async function ({ phase, measures, ...rest }) {
  const measuresGroups = groupMeasures({ measures });
  const measuresMessage = stringifyMeasures({ phase, measuresGroups });
  const info = { measures: measuresGroups, measuresMessage };
  await emitEvent({ ...rest, type: 'perf', phase, info });
};

module.exports = {
  emitPerfEvent,
};
