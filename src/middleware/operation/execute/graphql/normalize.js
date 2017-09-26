'use strict';

const normalizeActions = function ({
  operation: { action, args, select: selectA },
}) {
  const actionsA = selectA
    .map(extractActionPath.bind(null, action))
    .reduce(reduceActions, {});
  const actionsB = Object.values(actionsA)
    .map(normalizeAction.bind(null, args));
  return actionsB;
};

const extractActionPath = function (action, { key, ...rest }) {
  const [, actionPath, keyA] = actionPathRegExp.exec(`${action}.${key}`);
  return { actionPath, key: keyA, ...rest };
};

// Turns 'aaa.bbb.ccc' into ['aaa.bbb', 'ccc']
const actionPathRegExp = /^(.*)\.([^.]+)$/;

const reduceActions = function (actions, { actionPath, ...rest }) {
  const { [actionPath]: { select = [] } = {} } = actions;
  const selectB = [...select, rest];
  return { ...actions, [actionPath]: { actionPath, select: selectB } };
};

const normalizeAction = function (args, { actionPath, select }) {
  const actionPathA = actionPath.split('.');
  const argsA = actionPathA.length === 1 ? args : {};
  return { actionPath: actionPathA, args: argsA, select };
};

module.exports = {
  normalizeActions,
};
