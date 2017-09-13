'use strict';

const { isEqual } = require('lodash');

const { pick, pickBy, omitBy, assignArray } = require('../../../../utilities');

const addNestedWrite = function ({ actions }) {
  const { actionPath: topActionPath, args: topArgs } = actions
    .find(({ actionPath }) => actionPath.length === 1);

  if (!isObject(topArgs.data)) { return actions; }

  const newActions = parseArgs({ args: topArgs, actionPath: topActionPath });
  const newActionsA = mergeActions({ oldActions: actions, newActions });
  return newActionsA;
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

const mergeActions = function ({ oldActions, newActions }) {
  const oldActionsA = oldActions.map(oldAction => {
    const newActionA = findAction({ actions: newActions, action: oldAction });
    if (newActionA === undefined) { return oldAction; }

    const newActionB = pick(newActionA, ['args', 'usesTopAction']);
    return { ...oldAction, ...newActionB };
  });
  const newActionsA = newActions.filter(newAction => {
    const oldActionA = findAction({ actions: oldActions, action: newAction });
    return oldActionA === undefined;
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
