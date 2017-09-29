'use strict';

const { mergeArrayReducer, mapValues, omit } = require('../../utilities');

const normalizeActions = function ({
  operationDef: { action, args: { select, ...args } },
}) {
  const actionsA = select
    .split(',')
    .map(parseSelect.bind(null, action))
    .reduce(mergeArrayReducer('actionPath'), {});
  const actionsB = mapValues(actionsA, actions => normalize({ args, actions }));
  const actionsC = Object.values(actionsB);
  return { actions: actionsC };
};

const parseSelect = function (action, select) {
  const [, actionPath, key, alias] = selectRegExp.exec(`${action}.${select}`);
  return { actionPath, key, alias };
};

// Turns 'aaa.bbb.ccc=alias' into ['aaa.bbb', 'ccc', 'alias']
const selectRegExp = /^([^=]*)\.([^.=]+)=?(.*)?$/;

const normalize = function ({ args, actions }) {
  const [{ actionPath }] = actions;
  const selectA = actions.map(action => omit(action, 'actionPath'));
  const actionPathA = actionPath.split('.');
  const argsA = actionPathA.length === 1 ? args : {};
  return { actionPath: actionPathA, args: argsA, select: selectA };
};

module.exports = {
  normalizeActions,
};
