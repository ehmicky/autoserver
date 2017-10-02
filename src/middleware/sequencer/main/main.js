'use strict';

const { sequenceRead } = require('./read');
const { sequenceWrite } = require('./write');

// Fire one or several commands for a set of actions
const sequenceActions = function ({ actionsGroupType, ...mInput }, nextLayer) {
  const sequencer = sequencers[actionsGroupType];
  return sequencer(mInput, nextLayer);
};

// Read and write actions are handled differently
const sequencers = {
  read: sequenceRead,
  write: sequenceWrite,
};

module.exports = {
  sequenceActions,
};
