'use strict';

const { isEqual } = require('lodash');

const { getCommand } = require('../../../constants');
const { resolveReadActions } = require('../read_actions');

const serialResolve = async function (
  { actions, top, idl, mInput },
  nextLayer,
) {
  const writeActions = getWriteActions({ actions });
  const { results } = await resolveReadActions(
    { actions: writeActions, top, idl, mInput },
    nextLayer,
  );
  const actionsA = actions
    .map(action => mergeSerialResult({ results, action }));
  return actionsA;
};

const getWriteActions = function ({ actions }) {
  return actions
    .filter(({ command }) => command.type !== 'find')
    .map(getSerialReadAction);
};

const getSerialReadAction = function ({ command: { multiple }, ...action }) {
  const command = getCommand({ commandType: 'find', multiple });

  return { ...action, command, internal: true };
};

const mergeSerialResult = function ({
  results,
  action,
  action: { command: { type: commandType }, args },
}) {
  if (commandType === 'find') { return action; }

  const resultsA = findSerialResults({ results, action });
  const actionA = getSerialAction({ results: resultsA, action, args });
  return actionA;
};

const findSerialResults = function ({ results, action }) {
  return results
    .filter(result => serialResultMatches({ result, action }));
};

const serialResultMatches = function ({
  result: { path },
  action: { commandPath },
}) {
  const pathA = removeIndexes({ path });
  return isEqual(commandPath, pathA);
};

const removeIndexes = function ({ path }) {
  return path.filter(index => typeof index !== 'number');
};

const getSerialAction = function ({ results, action }) {
  const dataPaths = results.map(({ path }) => path);
  const currentData = results.map(({ model }) => model);

  return { ...action, currentData, dataPaths };
};

module.exports = {
  serialResolve,
};
