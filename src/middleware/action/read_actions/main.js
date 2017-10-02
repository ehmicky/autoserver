'use strict';

const { getReadActions } = require('./read');
const { getParentActions } = require('./parent');

// Fire all read actions.
// Also fired by `currentData` middleware.
const resolveReadActions = function (
  { actions, top, idl: { shortcuts: { modelsMap } }, mInput, results },
  nextLayer,
) {
  const actionsA = getReadActions({ actions, top });

  const actionsB = getParentActions({ actions: actionsA, top, modelsMap });

  return nextLayer({
    ...mInput,
    actionsGroupType: 'read',
    actions: actionsB,
    results,
  });
};

module.exports = {
  resolveReadActions,
};
