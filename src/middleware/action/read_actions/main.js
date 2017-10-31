'use strict';

const { getParentActions } = require('./parent');

// Fire all read actions, retrieving some `results`.
// Also fired by `currentData` middleware for patch|delete actions.
const resolveReadActions = function (
  { actions, top, schema: { shortcuts: { modelsMap } }, mInput },
  nextLayer,
) {
  const actionsA = actions.filter(({ command }) => command.type === 'find');
  if (actionsA.length === 0) { return; }

  const actionsB = getParentActions({ actions: actionsA, top, modelsMap });

  return nextLayer({
    ...mInput,
    actionsGroupType: 'read',
    actions: actionsB,
  });
};

module.exports = {
  resolveReadActions,
};
