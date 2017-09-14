'use strict';

const { isEqual } = require('lodash');

const { throwError } = require('../../../../error');
const { pick, omit } = require('../../../../utilities');

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
    actions,
  });
  return actionsA;
};

  /*
  if (Array.isArray(data)) {
    return data
      .map((datum, index) => {
        const nestedActionPath = [...actionPath, index];
        return parseArgsData({
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
  */

const parseArgsData = function ({
  data,
  actionPath,
  modelsMap,
  topLevelAction,
  actions,
}) {
  validateData({ data, actionPath });

  const nestedKeys = getNestedKeys({
    data,
    actionPath,
    modelsMap,
    topLevelAction,
  });
  const actionsA = parseArgsDataNested({
    data,
    actionPath,
    modelsMap,
    topLevelAction,
    actions,
    nestedKeys,
  });
  const action = getAction({
    data,
    actionPath,
    modelsMap,
    topLevelAction,
    nestedKeys,
  });
  const actionsB = addAction({
    action,
    actions: actionsA,
  });
  return actionsB;
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

const parseArgsDataNested = function ({
  data,
  actionPath,
  modelsMap,
  topLevelAction,
  actions,
  nestedKeys,
}) {
  const nestedData = pick(data, nestedKeys);
  return Object.entries(nestedData).reduce(
    (actionsA, [attrName, datum]) => parseArgsData({
      data: datum,
      actionPath: [...actionPath, attrName],
      modelsMap,
      topLevelAction,
      actions: actionsA,
    }),
    actions
  );
};

const getAction = function ({
  data,
  actionPath,
  modelsMap,
  topLevelAction,
  topLevelAction: { actionConstant: { type: topType } },
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

  return { actionPath, args, actionConstant, modelName };
};

const addAction = function ({ action, actions }) {
  const oldAction = actions
    .find(oldActionA => isEqual(oldActionA.actionPath, action.actionPath));

  if (!oldAction) {
    return [...actions, action];
  }

  const actionA = {
    ...oldAction,
    ...action,
    args: { ...oldAction.args, ...action.args },
  };

  return actions
    .map(oldActionA => (oldActionA === oldAction ? actionA : oldActionA));
};

module.exports = {
  addNestedWrite,
};
