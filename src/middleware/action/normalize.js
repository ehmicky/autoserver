'use strict';

const { mergeArrayReducer, mapValues, omit } = require('../../utilities');

const normalizeActions = function ({
  operationDef: { action, args: { select, ...args } },
}) {
  const actionsA = select
    .split(',')
    .map(parseSelect.bind(null, action))
    .reduce(mergeArrayReducer('commandPath'), {});
  const actionsB = mapValues(actionsA, actions => normalize({ args, actions }));
  const actionsC = Object.values(actionsB);
  return { actions: actionsC };
};

const parseSelect = function (action, select) {
  const [, commandPath, key, alias] = selectRegExp.exec(`${action}.${select}`);
  return { commandPath, key, alias };
};

// Turns 'aaa.bbb.ccc=alias' into ['aaa.bbb', 'ccc', 'alias']
const selectRegExp = /^([^=]*)\.([^.=]+)=?(.*)?$/;

const normalize = function ({ args, actions }) {
  const [{ commandPath }] = actions;
  const selectA = actions.map(action => omit(action, 'commandPath'));
  const commandPathA = commandPath.split('.');
  const argsA = commandPathA.length === 1 ? args : {};
  return { commandPath: commandPathA, args: argsA, select: selectA };
};

module.exports = {
  normalizeActions,
};
