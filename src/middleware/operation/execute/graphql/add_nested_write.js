'use strict';

const { isEqual } = require('lodash');

const { pick, omit, assignArray } = require('../../../../utilities');

const { getModel, getActionConstant } = require('./models_utility');

const addNestedWrite = function ({ actions, modelsMap }) {
  const topLevelAction = actions
    .find(({ actionPath }) => actionPath.length === 1);
  const {
    actionPath: topActionPath,
    args: topArgs,
    args: { data },
  } = topLevelAction;

  // TODO: should throw here
  if (!isValidData(data)) { return actions; }

  const newActions = parseArgs({
    args: topArgs,
    data,
    actionPath: topActionPath,
    actions,
    modelsMap,
    topLevelAction,
  });
  const newActionsA = mergeActions({
    oldActions: actions,
    newActions,
    modelsMap,
    topLevelAction,
  });
  return newActionsA;
};

const parseArgs = function ({
  args,
  data,
  actionPath,
  actions,
  modelsMap,
  topLevelAction,
}) {
  if (Array.isArray(data)) {
    return data
      .map((datum, index) => {
        const nestedActionPath = [...actionPath, index];
        return parseArgs({
          args,
          data: datum,
          actionPath: nestedActionPath,
          actions,
          modelsMap,
          topLevelAction,
        });
      })
      .reduce(assignArray, []);
  }

  const nestedKeys = Object.keys(data).filter(attrName => {
    const nestedActionPath = [...actionPath.slice(1), attrName];
    const nestedActionA = getModel({
      modelsMap,
      topLevelAction,
      actionPath: nestedActionPath,
    });

    return nestedActionA !== undefined && nestedActionA.modelName !== undefined;
  });

  const dataA = omit(data, nestedKeys);
  const nestedData = pick(data, nestedKeys);

  const nestedActions = Object.entries(nestedData)
    .map(([attrName, nestedDatum]) => {
      // TODO: uncomment
      // if (!isValidData(nestedDatum)) { throw; }

      const nestedActionPath = [...actionPath, attrName];
      return parseArgs({
        data: nestedDatum,
        actionPath: nestedActionPath,
        actions,
        modelsMap,
        topLevelAction,
      });
    })
    .reduce(assignArray, []);

  const action = { actionPath, args: { ...args, data: dataA } };
  return [action, ...nestedActions];
};

const isValidData = function (data) {
  return isObject(data) || (Array.isArray(data) && data.every(isObject));
};

const isObject = function (obj) {
  return obj && obj.constructor === Object;
};

const mergeActions = function ({
  oldActions,
  newActions,
  modelsMap,
  topLevelAction,
  topLevelAction: { actionConstant: { type: topType } },
}) {
  const oldActionsA = oldActions.map(oldAction => {
    const newActionA = findAction({ actions: newActions, action: oldAction });
    if (newActionA === undefined) { return oldAction; }

    const newActionB = pick(newActionA, 'args');

    // Nested actions due to nested `args.data` reuses top-level action
    // Others are simply for selection, i.e. are find actions
    const actionConstant = getActionConstant({
      actionType: topType,
      isArray: oldAction.actionConstant.multiple,
    });

    return { ...oldAction, ...newActionB, actionConstant };
  });

  const newActionsA = newActions
    .filter(newAction => {
      const oldActionA = findAction({ actions: oldActions, action: newAction });
      return oldActionA === undefined;
    })
    .map(newAction => {
      const alreadyDefined = newAction.actionConstant !== undefined &&
        newAction.modelName !== undefined;
      if (alreadyDefined) { return newAction; }

      const actionPath = newAction.actionPath
        .slice(1)
        // Remove array indexes
        .filter(key => typeof key !== 'number');
      const { modelName, isArray } = getModel({
        modelsMap,
        topLevelAction,
        actionPath,
      });

      const actionConstant = getActionConstant({
        actionType: topType,
        isArray,
      });

      return { ...newAction, actionConstant, modelName };
    });

  return [...oldActionsA, ...newActionsA];
};

const findAction = function ({ actions, action }) {
  return actions.find(
    actionA => isEqual(actionA.actionPath, action.actionPath)
  );
};

module.exports = {
  addNestedWrite,
};
