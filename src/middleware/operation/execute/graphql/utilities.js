'use strict';

const { ACTIONS } = require('../../../../constants');
const { throwError } = require('../../../../error');

const getModel = function ({
  modelsMap,
  top: { modelName, actionConstant: { multiple } },
  actionPath,
}) {
  const actionPathA = actionPath
    .slice(1)
    .filter(key => typeof key !== 'number');

  if (actionPathA.length === 0) {
    return { modelName, isArray: multiple };
  }

  return findModel({ modelsMap, modelName, actionPath: actionPathA });
};

const findModel = function ({ modelsMap, modelName, actionPath }) {
  const [actionName, ...childActionPath] = actionPath;

  if (!modelsMap[modelName][actionName]) { return; }

  const { target: childModelName, isArray } = modelsMap[modelName][actionName];

  if (childActionPath.length > 0) {
    return findModel({
      modelsMap,
      modelName: childModelName,
      actionPath: childActionPath,
    });
  }

  return { modelName: childModelName, isArray };
};

const getActionConstant = function ({ actionType, isArray }) {
  const actionConstant = ACTIONS.find(
    ({ multiple, type }) => multiple === isArray && type === actionType
  );

  if (!actionConstant) {
    const message = `Action '${actionType}' is unknown`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return actionConstant;
};

module.exports = {
  getModel,
  getActionConstant,
};
