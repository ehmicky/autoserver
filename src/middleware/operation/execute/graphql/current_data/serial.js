'use strict';

const { isEqual } = require('lodash');

const { getActionConstant } = require('../utilities');
const { resolveReadActions } = require('../read_actions');

const serialResolve = async function ({
  actions,
  top,
  nextLayer,
  otherLayer,
  mInput,
}) {
  const writeActions = getWriteActions({ actions });
  const responses = await resolveReadActions({
    actions: writeActions,
    top,
    nextLayer,
    otherLayer,
    mInput,
  });
  const actionsA = actions
    .map(action => mergeSerialResponse({ responses, action }));
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

const mergeSerialResponse = function ({
  responses,
  action,
  action: { actionConstant, args },
}) {
  if (actionConstant.type === 'find') { return action; }

  const responsesA = findSerialResponses({ responses, action });
  const actionA = getSerialAction({ responses: responsesA, action, args });
  return actionA;
};

const findSerialResponses = function ({ responses, action }) {
  return responses
    .filter(response => serialResponseMatches({ response, action }));
};

const serialResponseMatches = function ({
  response: { path },
  action: { actionPath },
}) {
  const pathA = removeIndexes({ path });
  return isEqual(actionPath, pathA);
};

const removeIndexes = function ({ path }) {
  return path.filter(index => typeof index !== 'number');
};

const getSerialAction = function ({ responses, action, args }) {
  const dataPaths = responses.map(({ path }) => path);
  const currentData = responses.map(({ model }) => model);
  const argsA = mergeData({ args, action, currentData });

  return { ...action, currentData, dataPaths, args: argsA };
};

// Merge current models with the data we want to update,
// to obtain the final models we want to use as replacement
const mergeData = function ({
  args: { data },
  action: { actionConstant: { type: actionType } },
  currentData,
}) {
  if (actionType === 'delete') { return {}; }

  const [newData] = data;
  const newDataA = currentData
    .map(currentDatum => ({ ...currentDatum, ...newData }));
  return { data: newDataA };
};

module.exports = {
  serialResolve,
};
