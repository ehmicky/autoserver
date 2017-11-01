'use strict';

// Fire all read actions, retrieving some `results`.
// Also fired by `currentData` middleware for patch|delete actions.
const resolveReadActions = function (mInput, nextLayer) {
  const mInputA = { ...mInput, actionsGroupType: 'read' };
  return nextLayer(mInputA, 'sequencer');
};

module.exports = {
  resolveReadActions,
};
