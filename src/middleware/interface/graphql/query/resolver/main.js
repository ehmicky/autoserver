'use strict';


const { actions } = require('../../../../../idl');
const { EngineError } = require('../../../../../error');
const { typenameResolver } = require('./typename');
const { nestedModelResolver } = require('./nested_model');
const { topLevelModelResolver } = require('./top_level_model');
const { setParentModel, hasParentModel } = require('./utilities');


/**
 * GraphQL-anywhere uses a single resolver: here it is
 **/
const getResolver = ({ modelsMap }) => async function (name, parent = {}, args, { callback, graphqlMethod }) {
  args = args || {};

  // Introspection type name
  if (name === '__typename') {
    return typenameResolver({ parent });
  }

  // Top-level and non-top-level attributes are handled differently
  const subResolver = hasParentModel(parent) ? nestedModelResolver : topLevelModelResolver;
  // Retrieve main input passed to database layer
  const { multiple, modelName, actionType, directReturn } = subResolver({ name, modelsMap, parent, args });
  // Shortcuts resolver if we already know the final result
  if (directReturn !== undefined) { return directReturn; }

  // Retrieve action name, passed to database layer
  const { name: action } = actions.find(action => action.multiple === multiple && action.actionType === actionType) || {};
  // This means the query specified an attribute that is not present in IDL definition
  if (action == null || modelName == null) {
    throw new EngineError(`Action '${name}' does not exist`, { reason: 'INPUT_VALIDATION' });
  }

  if (graphqlMethods[actionType] !== graphqlMethod) {
    throw new EngineError(`Cannot perform action '${name}' with a GraphQL '${graphqlMethod}'`, {
      reason: 'INPUT_VALIDATION',
    });
  }

  // Fire database layer, retrieving value passed to children
  const response = await callback({ action, modelName, args });
  // Tags the response as belonging to that modelName
  setParentModel(response, { action, modelName, actionType });
  return response;
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
