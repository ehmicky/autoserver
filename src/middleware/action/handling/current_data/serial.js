'use strict';

const { isEqual } = require('lodash');

const { getActionConstant } = require('../../../../constants');
const { resolveReadActions } = require('../read_actions');

const serialResolve = async function (
  { actions, top, modelsMap, mInput },
  nextLayer,
) {
  const writeActions = getWriteActions({ actions });
  const results = await resolveReadActions(
    { actions: writeActions, top, modelsMap, mInput },
    nextLayer,
  );
  const actionsA = actions
    .map(action => mergeSerialResult({ results, action }));
  return actionsA;
};

const getWriteActions = function ({ actions }) {
  return actions
    .filter(({ actionConstant }) => actionConstant.type !== 'find')
    .map(getSerialReadAction);
};

const getSerialReadAction = function ({
  actionConstant: { multiple },
  ...action
}) {
  const actionConstant = getActionConstant({
    actionType: 'find',
    isArray: multiple,
  });

  return { ...action, actionConstant, internal: true };
};

const mergeSerialResult = function ({
  results,
  action,
  action: { actionConstant, args },
}) {
  if (actionConstant.type === 'find') { return action; }

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
  action: { actionPath },
}) {
  const pathA = removeIndexes({ path });
  return isEqual(actionPath, pathA);
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
