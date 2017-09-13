'use strict';

const { ACTIONS } = require('../../../../constants');
const { throwError } = require('../../../../error');

const getModel = function ({
  modelsMap,
  topLevelAction: { modelName },
  actionPath,
}) {
  return findModel({ modelsMap, modelName, actionPath });
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
    const message = `Action '${actionType}' does not exist`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return actionConstant;
};

module.exports = {
  getModel,
  getActionConstant,
};
