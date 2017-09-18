'use strict';

const { uniq } = require('lodash');

const { throwError } = require('../../../../error');
const { mapValues, assignArray } = require('../../../../utilities');

const {
  getTopLevelAction,
  getModel,
  getActionConstant,
} = require('./utilities');

const addNestedWrite = function ({ actions, modelsMap }) {
  const topLevelAction = getTopLevelAction({ actions });
  const { actionPath, args: { data } } = topLevelAction;

  if (data === undefined) { return actions; }

  const responses = getResponses({ data, key: actionPath[0] });
  const actionsA = parseArgsData({
    data,
    actionPath,
    responses,
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
  responses,
  modelsMap,
  topLevelAction,
  oldActions,
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
    responses,
    modelsMap,
    topLevelAction,
    oldActions,
    nestedKeys,
  });
  const action = getAction({
    data: dataA,
    actionPath,
    responses,
    modelsMap,
    topLevelAction,
    oldActions,
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
  responses,
  modelsMap,
  topLevelAction,
  oldActions,
  nestedKeys,
}) {
  return nestedKeys
    .map(nestedKey => {
      const nestedActionPath = [...actionPath, nestedKey];
      const nestedData = data
        .map(datum => (datum[nestedKey] === undefined ? [] : datum[nestedKey]))
        .reduce(assignArray, []);
      const nestedResponses = responses
        .map((response, index) => getResponses({
          data: data[index][nestedKey],
          key: nestedKey,
          response,
        }))
        .reduce(assignArray, []);

      return parseArgsData({
        data: nestedData,
        actionPath: nestedActionPath,
        responses: nestedResponses,
        modelsMap,
        topLevelAction,
        oldActions,
      });
    })
    .reduce(assignArray, []);
};

const getResponses = function ({
  data = [],
  key,
  response: { path: parentPath = [] } = {},
}) {
  if (!Array.isArray(data)) {
    return getResponse({ parentPath, key, data });
  }

  return data.map(
    (datum, index) => getResponse({ parentPath, key, data: datum, index }),
  );
};

const getResponse = function ({ parentPath, key, data: { id }, index }) {
  const path = index === undefined
    ? [...parentPath, key]
    : [...parentPath, key, Number(index)];

  if (typeof id !== 'string') {
    const errorPath = path.slice(1).join('.');
    const message = `The model at 'data.${errorPath} is missing an 'id' attribute.`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return { id, path };
};

const getAction = function ({
  data,
  actionPath,
  responses,
  modelsMap,
  topLevelAction,
  topLevelAction: { actionConstant: { type: topType } },
  oldActions,
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
        if (!nestedKeys.includes(key)) { return value; }

        return Array.isArray(value) ? value.map(({ id }) => id) : value.id;
      },
    ),
  );
  const args = { data: dataA };

  const action = { actionPath, responses, args, actionConstant, modelName };

  const oldAction = findAction({ actions: oldActions, action });

  if (!oldAction) { return action; }

  const actionA = {
    // We want to keep `action` ordering, but `oldAction` should still have
    // lowest priority, so we repeat `...action`
    ...action,
    ...oldAction,
    ...action,
    args: { ...oldAction.args, ...action.args },
  };
  return moveSelect(actionA);
};

const findAction = function ({ actions, action }) {
  return actions.find(
    actionA => actionA.actionPath.join('.') === action.actionPath.join('.')
  );
};

const moveSelect = function ({ select, responses, ...action }) {
  const responsesA = responses.map(response => ({ ...response, select }));
  return { responses: responsesA, ...action };
};

const filterAction = function ({ action, action: { args: { data } } }) {
  const isEmptyAction = data.length === 0;
  if (isEmptyAction) { return []; }

  return [action];
};

const mergeActions = function ({ oldActions, actions }) {
  const oldActionsA = oldActions.filter(
    oldAction => findAction({ actions, action: oldAction }) === undefined
  );
  return [...oldActionsA, ...actions];
};

module.exports = {
  addNestedWrite,
};
