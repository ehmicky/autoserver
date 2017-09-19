'use strict';

const { assignArray } = require('../../../../utilities');

const mergeWriteActions = function ({ actions }) {
  return actions.reduce(
    (actionsA, action, index) => {
      const alreadyHandled = actionsA
        .reduce(assignArray, [])
        .some(actionA => actionA === action);
      if (alreadyHandled) { return actionsA; }

      const nextActions = actions.slice(index);
      const actionsB = nextActions.filter(({ actionConstant, modelName }) =>
        actionConstant.name === action.actionConstant.name &&
        modelName === action.modelName
      );
      return [...actionsA, actionsB];
    },
    [],
  );
};

module.exports = {
  mergeWriteActions,
};
