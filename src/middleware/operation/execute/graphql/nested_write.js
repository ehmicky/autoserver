'use strict';

const { uniq } = require('lodash');

const { throwError } = require('../../../../error');
const { mapValues, assignArray } = require('../../../../utilities');

const {
  getTopLevelAction,
  getModel,
  getActionConstant,
} = require('./utilities');

const parseNestedWrite = function ({ actions, modelsMap }) {
  const topLevelAction = getTopLevelAction({ actions });
  const { actionPath, args: { data } } = topLevelAction;

  if (data === undefined) { return actions; }

  const dataPaths = getDataPath({ data, path: actionPath });
  const actionsA = parseArgsData({
    data,
    actionPath,
    dataPaths,
    modelsMap,
    topLevelAction,
  });
  const actionsB = mergeActions({ oldActions: actions, actions: actionsA });
  return actionsB;
};

const parseArgsData = function ({
  data,
  actionPath,
  dataPaths,
  modelsMap,
  topLevelAction,
}) {
  const dataA = normalizeData({ data });

  validateData({ data: dataA, actionPath });

  const nestedKeys = getNestedKeys({
    data: dataA,
    actionPath,
    modelsMap,
    topLevelAction,
  });
  const nestedActions = getNestedActions({
    data: dataA,
    actionPath,
    dataPaths,
    modelsMap,
    topLevelAction,
    nestedKeys,
  });
  const action = getAction({
    data: dataA,
    actionPath,
    dataPaths,
    modelsMap,
    topLevelAction,
    nestedKeys,
  });
  const actionA = filterAction({ action });
  return [...actionA, ...nestedActions];
};

const normalizeData = function ({ data }) {
  return Array.isArray(data) ? data : [data];
};

const validateData = function ({ data, actionPath }) {
  const isValidData = data.every(isObject);
  if (isValidData) { return; }

  const message = `'data' argument at ${actionPath.join('.')} should be an object or an array of objects, instead of: ${JSON.stringify(data)}`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const isModelType = function (val) {
  if (isObject(val)) { return true; }

  return Array.isArray(val) && val.every(isObject);
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
  const nestedKeys = data
    .map(Object.keys)
    .reduce(assignArray, []);
  const nestedKeysA = uniq(nestedKeys);
  const nestedKeysB = nestedKeysA.filter(attrName => {
    const model = getModel({
      modelsMap,
      topLevelAction,
      actionPath: [...actionPath, attrName],
    });
    return model !== undefined && model.modelName !== undefined;
  });
  return nestedKeysB;
};

const getNestedActions = function ({
  data,
  dataPaths,
  actionPath,
  modelsMap,
  topLevelAction,
  nestedKeys,
}) {
  return nestedKeys
    .map(nestedKey => {
      const nestedActionPath = [...actionPath, nestedKey];
      const nestedData = data
        .map(datum => datum[nestedKey])
        .reduce(assignArray, []);
      const nestedDataA = nestedData.filter(isObject);

      // In the same collection, some keys might be populated, and others not
      // E.g. [{ child: { id: 'id', ... } }, { child: 'id' }]
      // Partial actions are marked so that both a write and a read actions
      // are fired, since the write action's return value alone is partial.
      // The flag is inherited by children.
      const isPartial = nestedData.length !== nestedDataA.length;

      const nestedDataPaths = isPartial
        ? []
        : dataPaths
          .map((dataPath, index) => getDataPath({
            data: data[index][nestedKey],
            path: [...dataPath, nestedKey],
          }))
          .reduce(assignArray, []);

      return parseArgsData({
        data: nestedDataA,
        actionPath: nestedActionPath,
        dataPaths: nestedDataPaths,
        modelsMap,
        topLevelAction,
      });
    })
    .reduce(assignArray, []);
};

const getDataPath = function ({ data, path }) {
  if (!isModelType(data)) { return []; }

  if (!Array.isArray(data)) { return [path]; }

  return Object.keys(data).map(ind => [...path, Number(ind)]);
};

const getAction = function ({
  data,
  actionPath,
  dataPaths,
  modelsMap,
  topLevelAction,
  topLevelAction: { actionConstant: { type: topType } },
  nestedKeys,
}) {
  const { modelName } = getModel({ modelsMap, topLevelAction, actionPath });

  // Nested actions due to nested `args.data` reuses top-level action
  // Others are simply for selection, i.e. are find actions
  const actionConstant = getActionConstant({
    actionType: topType,
    isArray: true,
  });

  const dataA = data.map(datum =>
    mapValues(
      datum,
      (value, key) => {
        if (!(nestedKeys.includes(key) && isModelType(value))) { return value; }

        return Array.isArray(value) ? value.map(({ id }) => id) : value.id;
      },
    ),
  );
  const args = { data: dataA };

  return { actionPath, args, actionConstant, modelName, dataPaths };
};

const filterAction = function ({ action, action: { args: { data } } }) {
  const isEmptyAction = data.length === 0;
  if (isEmptyAction) { return []; }

  return [action];
};

const mergeActions = function ({ oldActions, actions }) {
  const actionsA = actions.map(action => {
    const oldAction = findAction({ actions: oldActions, action });
    // We want `action` to have priority, but also want to keep keys order,
    // hence we repeat `...action`
    return { ...action, ...oldAction, ...action };
  });

  const oldActionsA = oldActions.filter(oldAction => {
    const action = findAction({ actions, action: oldAction });
    return action === undefined || action.dataPaths.length === 0;
  });

  return [...oldActionsA, ...actionsA];
};

const findAction = function ({ actions, action }) {
  return actions.find(({ actionPath }) =>
    actionPath.join('.') === action.actionPath.join('.')
  );
};

module.exports = {
  parseNestedWrite,
};
