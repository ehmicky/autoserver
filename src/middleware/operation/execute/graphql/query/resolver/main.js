'use strict';


const { actions } = require('../../../../../../constants');
const { EngineError } = require('../../../../../../error');
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
const getResolver = ({ modelsMap }) => async function mainResolver(
  name,
  parent = {},
  args,
  { callback, graphqlMethod }
) {
  args = args || {};

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
  // Retrieve main input passed to database layer
  const resolverReturn = subResolver({ name, modelsMap, parent, args });
  const { multiple, modelName, actionType, directReturn } = resolverReturn;
  // Shortcuts resolver if we already know the final result
  if (directReturn !== undefined) { return directReturn; }

  // Retrieve action name, passed to database layer
  const action = actions.find(act => {
    return act.multiple === multiple && act.type === actionType;
  });
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

  // Full recursive action path, e.g. 'findModel.findChild'
  const { fullAction: parentFullAction } = getParentModel(parent);
  const fullAction = parentFullAction ? `${parentFullAction}.${name}` : name;

  // Fire database layer, retrieving value passed to children
  const response = await callback({ action, fullAction, modelName, args });

  // Tags the response as belonging to that modelName
  setParentModel(response.data, { action, modelName, fullAction });

  return response.data;
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
