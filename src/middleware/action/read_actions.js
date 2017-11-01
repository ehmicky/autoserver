'use strict';

// Fire all read actions, retrieving some `results`.
// Also fired by `currentData` middleware for patch|delete actions.
const resolveReadActions = function (mInput, nextLayer) {
  return nextLayer({ ...mInput, actionsGroupType: 'read' });
};

module.exports = {
  resolveReadActions,
};
