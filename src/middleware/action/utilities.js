'use strict';

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

module.exports = {
  getModel,
};
