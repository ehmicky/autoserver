'use strict';

const { ACTIONS } = require('../../../../../constants');
const { EngineError } = require('../../../../../error');

const { typenameResolver } = require('./typename');
const { metadataResolver } = require('./metadata');
const { nestedModelResolver } = require('./nested_model');
const { topLevelModelResolver } = require('./top_level_model');
const {
  getParentModel,
  setParentModel,
  hasParentModel,
} = require('./utilities');

/**
 * GraphQL-anywhere uses a single resolver: here it is
 **/
// eslint-disable-next-line max-params
const getResolver = async function (
  modelsMap,
  name,
  parent = {},
  oArgs,
  { callback: cbFunc, graphqlMethod }
) {
  // Introspection type name
  if (name === '__typename') {
    return typenameResolver({ parent });
  }

  // Metadata, e.g. pagination information
  if (name === '__metadata') {
    return metadataResolver({ parent });
  }

  // Top-level and non-top-level attributes are handled differently
  const subResolver = hasParentModel(parent)
    ? nestedModelResolver
    : topLevelModelResolver;
  const response = await normalResolver({
    modelsMap,
    name,
    parent,
    oArgs,
    cbFunc,
    graphqlMethod,
    subResolver,
  });
  return response;
};

const normalResolver = async function ({
  modelsMap,
  name,
  parent,
  oArgs,
  cbFunc,
  graphqlMethod,
  subResolver,
}) {
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

  // Retrieve action name, passed to database layer
  const action = ACTIONS.find(act =>
    act.multiple === multiple && act.type === actionType
  );

  validateAction({ action, modelName, name, graphqlMethod, actionType });

  const fullAction = getFullAction({ parent, name });

  // Fire database layer, retrieving value passed to children
  const response = await cbFunc({ action, fullAction, modelName, args });

  // Tags the response as belonging to that modelName
  setParentModel(response.data, { action, modelName, fullAction });

  return response.data;
};

// Full recursive action path, e.g. 'findModel.findChild'
const getFullAction = function ({ parent, name }) {
  const { fullAction: parentFullAction } = getParentModel(parent);
  const fullAction = parentFullAction ? `${parentFullAction}.${name}` : name;
  return fullAction;
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
  getResolver,
};
