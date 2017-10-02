'use strict';

const { mergeArrayReducer, mapValues, omit } = require('../../utilities');

// Turn `args.select` into a set of `actions`
const parseActions = function ({
  operationDef: {
    commandName,
    args: { select, ...args },
  },
}) {
  const actionsA = select
    .split(',')
    .map(selectA => parseSelect({ commandName, select: selectA }))
    // `args.select` with the same `commandPath` are grouped into actions
    .reduce(mergeArrayReducer('commandPath'), {});
  const actionsB = mapValues(
    actionsA,
    actions => normalizeAction({ args, actions }),
  );
  const actionsC = Object.values(actionsB);
  return { actions: actionsC };
};

// Turns `args.select` 'aaa.bbb.ccc=ddd' into:
// `commandPath` 'aaa.bbb', `key` 'ccc', `alias` 'ddd']
const parseSelect = function ({ commandName, select }) {
  const [
    ,
    commandPath,
    key,
    alias,
  ] = selectRegExp.exec(`${commandName}.${select}`);
  return { commandPath, key, alias };
};

const selectRegExp = /^([^=]*)\.([^.=]+)=?(.*)?$/;

// From `args` + map of `COMMAND_PATH: [{ commandPath, key, alias }]`
// to array of `{ commandPath, args, select: [{ key, alias }] }`
const normalizeAction = function ({
  args,
  actions,
  actions: [{ commandPath }],
}) {
  const commandPathA = commandPath.split('.');
  // `args` is only assigned to top-level action
  const argsA = commandPathA.length === 1 ? args : {};
  const selectA = actions.map(action => omit(action, 'commandPath'));
  return { commandPath: commandPathA, args: argsA, select: selectA };
};

module.exports = {
  parseActions,
};
