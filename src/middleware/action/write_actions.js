'use strict';

// Fire all write actions, retrieving some `results`
const resolveWriteActions = function (mInput, nextLayer) {
  return nextLayer(mInput, 'sequencer');
};

module.exports = {
  resolveWriteActions,
};
