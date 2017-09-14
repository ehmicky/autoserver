'use strict';

const { isEqual } = require('lodash');

const { throwError } = require('../../../../error');
const { omit, assignArray } = require('../../../../utilities');

const { getModel, getActionConstant } = require('./models_utility');

const addNestedWrite = function ({ actions, modelsMap }) {
  const topLevelAction = actions
    .find(({ actionPath }) => actionPath.length === 1);
  const { actionPath: topActionPath, args: { data } } = topLevelAction;

  const actionsA = parseArgsData({
    data,
    actionPath: topActionPath,
    modelsMap,
    topLevelAction,
    oldActions: actions,
  });
  const actionsB = mergeActions({ oldActions: actions, actions: actionsA });
  return actionsB;
};

const parseArgsData = function ({
  data,
  actionPath,
  modelsMap,
  topLevelAction,
  oldActions,
}) {
  validateData({ data, actionPath });

  if (Array.isArray(data)) {
    return parseMultipleArgsData({
      data,
      actionPath,
      modelsMap,
      topLevelAction,
      oldActions,
    });
  }

  const nestedKeys = getNestedKeys({
    data,
    actionPath,
    modelsMap,
    topLevelAction,
  });
  const nestedActions = getNestedActions({
    data,
    actionPath,
    modelsMap,
    topLevelAction,
    oldActions,
    nestedKeys,
  });
  const action = getAction({
    data,
    actionPath,
    modelsMap,
    topLevelAction,
    oldActions,
    nestedKeys,
  });
  return [action, ...nestedActions];
};

const validateData = function ({ data, actionPath }) {
  const isValidData = isObject(data) ||
    (Array.isArray(data) && data.every(isObject));
  if (isValidData) { return; }

  const message = `'data' argument at ${actionPath.join('.')} should be an object or an array of objects, instead of: ${JSON.stringify(data)}`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const isObject = function (obj) {
  return obj && obj.constructor === Object;
};

const parseMultipleArgsData = function ({
  data,
  actionPath,
  modelsMap,
  topLevelAction,
}) {
  return data.reduce(
    (actionsB, datum, index) => {
      return parseArgsData({
        data: datum,
        actionPath: [...actionPath, index],
        modelsMap,
        topLevelAction,
        actions: actionsB,
      });
    },
  );
};

const getNestedKeys = function ({
  data,
  actionPath,
  modelsMap,
  topLevelAction,
}) {
  return Object.keys(data).filter(attrName => {
    const model = getModel({
      modelsMap,
      topLevelAction,
      actionPath: [...actionPath, attrName],
    });
    return model !== undefined && model.modelName !== undefined;
  });
};

const getNestedActions = function ({
  data,
  actionPath,
  modelsMap,
  topLevelAction,
  oldActions,
  nestedKeys,
}) {
  return Object.entries(data)
    .filter(([attrName]) => nestedKeys.includes(attrName))
    .map(([attrName, datum]) => parseArgsData({
      data: datum,
      actionPath: [...actionPath, attrName],
      modelsMap,
      topLevelAction,
      oldActions,
    }))
    .reduce(assignArray, []);
};

const getAction = function ({
  data,
  actionPath,
  modelsMap,
  topLevelAction,
  topLevelAction: { actionConstant: { type: topType } },
  oldActions,
  nestedKeys,
}) {
  const { modelName, isArray } = getModel({
    modelsMap,
    topLevelAction,
    actionPath,
  });

  // Nested actions due to nested `args.data` reuses top-level action
  // Others are simply for selection, i.e. are find actions
  const actionConstant = getActionConstant({ actionType: topType, isArray });

  const dataA = omit(data, nestedKeys);
  const args = { data: dataA };

  const action = { actionPath, args, actionConstant, modelName };

  const oldAction = findAction({ actions: oldActions, action });

  if (!oldAction) { return action; }

  return {
    ...oldAction,
    ...action,
    args: { ...oldAction.args, ...action.args },
  };
};

const mergeActions = function ({ oldActions, actions }) {
  const oldActionsA = oldActions.filter(
    oldAction => findAction({ actions, action: oldAction }) === undefined
  );
  return [...oldActionsA, ...actions];
};

const findAction = function ({ actions, action }) {
  return actions.find(
    actionA => isEqual(actionA.actionPath, action.actionPath)
  );
};

// TODO: check when actions need to be sorted, and sort them before that

module.exports = {
  addNestedWrite,
};
