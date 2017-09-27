'use strict';

const normalizeActions = function ({
  operation: { action, args: { select, ...args } },
}) {
  const actionsA = select
    .split(',')
    .map(parseSelect.bind(null, action))
    .reduce(groupBySelect, {});
  const actionsB = Object.values(actionsA)
    .map(normalizeAction.bind(null, args));
  return actionsB;
};

const parseSelect = function (action, select) {
  const [, actionPath, key, alias] = selectRegExp.exec(`${action}.${select}`);
  return { actionPath, key, alias };
};

// Turns 'aaa.bbb.ccc=alias' into ['aaa.bbb', 'ccc', 'alias']
const selectRegExp = /^([^=]*)\.([^.=]+)=?(.*)?$/;

const groupBySelect = function (actions, { actionPath, ...rest }) {
  const { [actionPath]: { select = [] } = {} } = actions;
  const selectA = [...select, rest];
  return { ...actions, [actionPath]: { actionPath, select: selectA } };
};

const normalizeAction = function (args, { actionPath, select }) {
  const actionPathA = actionPath.split('.');
  const argsA = actionPathA.length === 1 ? args : {};
  return { actionPath: actionPathA, args: argsA, select };
};

module.exports = {
  normalizeActions,
};
