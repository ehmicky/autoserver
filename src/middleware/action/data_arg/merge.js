'use strict';

// Add actions parsed from `args.data`
const mergeActions = function ({ readActions, writeActions }) {
  const writeActionsA = writeActions
    .map(writeAction => mergeAction({ readActions, writeAction }));
  // Remove top-level read action, only keep write one
  const readActionsA = readActions
    .filter(readAction => readAction.commandPath.length !== 1);
  return [...writeActionsA, ...readActionsA];
};

// If an action was already created from `args.select`, merges it
const mergeAction = function ({ readActions, writeAction }) {
  const readAction = findAction({
    actions: readActions,
    action: writeAction,
  });
  if (!readAction) { return writeAction; }

  return {
    ...readAction,
    ...writeAction,
    args: { ...readAction.args, ...writeAction.args },
  };
};

const findAction = function ({ actions, action }) {
  return actions.find(({ commandPath }) =>
    commandPath.join('.') === action.commandPath.join('.')
  );
};

module.exports = {
  mergeActions,
};
