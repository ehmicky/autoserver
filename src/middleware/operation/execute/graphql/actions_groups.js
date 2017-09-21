'use strict';

const addActionsGroups = function ({ actions: allActions }) {
  const writeActions = getWriteActions({ allActions });
  const readActions = getReadActions({ allActions });
  return { writeActions, readActions };
};

const getWriteActions = function ({ allActions }) {
  const writeActionsA = allActions.filter(action => !isReadAction(action));
  const writeActionsB = writeActionsA.reduce(
    (writeActions, action) => {
      const { modelName } = action;
      const { [modelName]: actionsByModel = [] } = writeActions;
      const actionsByModelA = [...actionsByModel, action];
      return { ...writeActions, [action.modelName]: actionsByModelA };
    },
    {},
  );
  const writeActionsC = Object.values(writeActionsB);
  return writeActionsC;
};

const getReadActions = function ({ allActions }) {
  return allActions
    .filter(isReadAction)
    .map(action => [action]);
};

const isReadAction = function ({ actionConstant: { type } }) {
  return type === 'find';
};

module.exports = {
  addActionsGroups,
};
