'use strict';

const { isEqual } = require('lodash');

const { pick, pickBy, omitBy, assignArray } = require('../../../../utilities');

const addNestedWrite = function ({ actions }) {
  const [topLevelAction, oldActions] = splitTopLevelAction({ actions });
  const { actionPath: topActionPath, args: topArgs } = topLevelAction;

  if (!isObject(topArgs.data)) { return actions; }

  const [{ args: topArgsA }, ...newActions] = parseArgs({
    args: topArgs,
    actionPath: topActionPath,
  });
  const topLevelActionA = { ...topLevelAction, args: topArgsA };
  const nestedActionsB = mergeNestedActions({ oldActions, newActions });
  return [topLevelActionA, ...nestedActionsB];
};

const splitTopLevelAction = function ({ actions }) {
  const topLevelAction = actions
    .find(({ actionPath }) => actionPath.length === 1);
  const nestedActions = actions.filter(action => action !== topLevelAction);
  return [topLevelAction, nestedActions];
};

const parseArgs = function ({ args, args: { data }, actionPath }) {
  const dataA = omitBy(data, isObject);
  const nestedData = pickBy(data, isObject);

  const nestedActions = Object.entries(nestedData)
    .map(([attrName, nestedDatum]) => {
      const nestedActionPath = [...actionPath, attrName];
      const nestedArgs = { data: nestedDatum };
      return parseArgs({ args: nestedArgs, actionPath: nestedActionPath });
    })
    .reduce(assignArray, []);

  const action = {
    actionPath,
    args: { ...args, data: dataA },
    usesTopAction: true,
  };
  return [action, ...nestedActions];
};

const isObject = function (value) {
  return value && value.constructor === Object;
};

const mergeNestedActions = function ({ oldActions, newActions }) {
  const oldActionsA = oldActions.map(oldAction => {
    const newActionA = newActions.find(
      newAction => isEqual(newAction.actionPath, oldAction.actionPath)
    );
    if (!newActionA) { return oldAction; }

    const newActionB = pick(newActionA, ['args', 'usesTopAction']);
    return { ...oldAction, ...newActionB };
  });
  const newActionsA = newActions.filter(newAction => {
    const oldActionA = oldActionsA.find(
      oldAction => isEqual(newAction.actionPath, oldAction.actionPath)
    );
    return oldActionA === undefined;
  });
  return [...oldActionsA, ...newActionsA];
};

module.exports = {
  addNestedWrite,
};
