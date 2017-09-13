'use strict';

const { isEqual } = require('lodash');

const { pick, pickBy, omitBy, assignArray } = require('../../../../utilities');

const addNestedWrite = function ({ actions }) {
  const { actionPath: topActionPath, args: topArgs, args: { data } } = actions
    .find(({ actionPath }) => actionPath.length === 1);

  if (!isValidData(data)) { return actions; }

  const newActions = parseArgs({
    args: topArgs,
    data,
    actionPath: topActionPath,
  });
  const newActionsA = mergeActions({ oldActions: actions, newActions });
  return newActionsA;
};

const parseArgs = function ({ args, data, actionPath }) {
  if (Array.isArray(data)) {
    return data
      .map((datum, index) => {
        const nestedActionPath = [...actionPath, index];
        return parseArgs({ args, data: datum, actionPath: nestedActionPath });
      })
      .reduce(assignArray, []);
  }

  const dataA = omitBy(data, isValidData);
  const nestedData = pickBy(data, isValidData);

  const nestedActions = Object.entries(nestedData)
    .map(([attrName, nestedDatum]) => {
      const nestedActionPath = [...actionPath, attrName];
      return parseArgs({ data: nestedDatum, actionPath: nestedActionPath });
    })
    .reduce(assignArray, []);

  const action = {
    actionPath,
    args: { ...args, data: dataA },
    usesTopAction: true,
  };
  return [action, ...nestedActions];
};

const isValidData = function (data) {
  return isObject(data) || (Array.isArray(data) && data.every(isObject));
};

const isObject = function (obj) {
  return obj && obj.constructor === Object;
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
