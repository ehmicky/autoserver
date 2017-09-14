'use strict';

const { uniq } = require('lodash');

const { throwError } = require('../../../../error');
const { omit, assignArray } = require('../../../../utilities');

const {
  getTopLevelAction,
  getModel,
  getActionConstant,
} = require('./utilities');

const addNestedWrite = function ({ actions, modelsMap }) {
  const topLevelAction = getTopLevelAction({ actions });
  const { actionPath, args: { data } } = topLevelAction;

  const actionsA = parseArgsData({
    data,
    actionPath,
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
    (Array.isArray(data) && flatten(data).every(isObject));
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
  const nestedKeys = normalizeData(data)
    .map(Object.keys)
    .reduce(assignArray, []);
  const nestedKeysA = uniq(nestedKeys);

  return nestedKeysA.filter(attrName => {
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
  return nestedKeys
    .map(nestedKey => {
      const nestedData = data.map(pickData.bind(null, nestedKey));
      return parseArgsData({
        data: nestedData,
        actionPath: [...actionPath, nestedKey],
        modelsMap,
        topLevelAction,
        oldActions,
      });
    })
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

  const dataA = omitData(nestedKeys, data);
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
    actionA => actionA.actionPath.join('.') === action.actionPath.join('.')
  );
};

const pickData = function (key, data) {
  if (Array.isArray(data)) {
    return data.map(datum => pickData(key, datum));
  }

  return data[key];
};

const omitData = function (keys, data) {
  if (Array.isArray(data)) {
    return data.map(datum => omitData(keys, datum));
  }

  return omit(data, keys);
};

const normalizeData = function (data) {
  if (!Array.isArray(data)) { return [data]; }

  return flatten(data);
};

const flatten = function (array) {
  if (!Array.isArray(array)) { return [array]; }

  return array
    .map(flatten)
    .reduce(assignArray, []);
};

module.exports = {
  addNestedWrite,
};
