'use strict';

const { ACTIONS } = require('../../../../../constants');
const { EngineError } = require('../../../../../error');

const { nestedModelResolver } = require('./nested_model');
const { topLevelModelResolver } = require('./top_level_model');
const { hasParentModel } = require('./utilities');
const { getParentModel, setParentModel } = require('./utilities');

const normalResolver = async function ({
  modelsMap,
  name,
  parent,
  oArgs,
  cbFunc,
  graphqlMethod,
}) {
  // Top-level and non-top-level attributes are handled differently
  const subResolver = hasParentModel(parent)
    ? nestedModelResolver
    : topLevelModelResolver;

  const args = oArgs || {};

  // Retrieve main input passed to database layer
  const { multiple, modelName, actionType, directReturn } = subResolver({
    name,
    modelsMap,
    parent,
    args,
  });
  // Shortcuts resolver if we already know the final result
  if (directReturn !== undefined) { return directReturn; }

  const action = getAction({
    multiple,
    actionType,
    modelName,
    name,
    graphqlMethod,
  });
  const fullAction = getFullAction({ parent, name });

  // Fire database layer, retrieving value passed to children
  const response = await cbFunc({ action, fullAction, modelName, args });

  // Tags the response as belonging to that modelName
  setParentModel(response.data, { action, modelName, fullAction });

  return response.data;
};

const getAction = function ({
  multiple,
  actionType,
  modelName,
  name,
  graphqlMethod,
}) {
  // Retrieve action name, passed to database layer
  const action = ACTIONS.find(act =>
    act.multiple === multiple && act.type === actionType
  );

  validateAction({ action, modelName, name, graphqlMethod, actionType });

  return action;
};

const validateAction = function ({
  action,
  modelName,
  name,
  graphqlMethod,
  actionType,
}) {
  // This means the query specified an attribute that is not present
  // in IDL definition
  if (action == null || modelName == null) {
    const message = `Action '${name}' does not exist`;
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }

  if (graphqlMethods[actionType] !== graphqlMethod) {
    const message = `Cannot perform action '${name}' with a GraphQL '${graphqlMethod}'`;
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }
};

// Full recursive action path, e.g. 'findModel.findChild'
const getFullAction = function ({ parent, name }) {
  const { fullAction: parentFullAction } = getParentModel(parent);
  const fullAction = parentFullAction ? `${parentFullAction}.${name}` : name;
  return fullAction;
};

// Mapping from IDL actions to GraphQL methods
const graphqlMethods = {
  find: 'query',
  create: 'mutation',
  replace: 'mutation',
  update: 'mutation',
  upsert: 'mutation',
  delete: 'mutation',
};

module.exports = {
  normalResolver,
};
