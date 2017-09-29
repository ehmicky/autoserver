'use strict';

const { sequenceRead } = require('./read');
const { sequenceWrite } = require('./write');

const sequenceActions = function ({ actionsGroupType, ...mInput }, nextLayer) {
  const sequencer = sequencers[actionsGroupType];
  return sequencer(mInput, nextLayer);
};

const sequencers = {
  read: sequenceRead,
  write: sequenceWrite,
};

module.exports = {
  sequenceActions,
};
