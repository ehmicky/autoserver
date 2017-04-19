'use strict';


const { operations } = require('../../../../../idl');
const { EngineError } = require('../../../../../error');
const { typenameResolver } = require('./typename');
const { nestedModelResolver } = require('./nested_model');
const { topLevelModelResolver } = require('./top_level_model');
const { setParentModel, hasParentModel } = require('./utilities');


/**
 * GraphQL-anywhere uses a single resolver: here it is
 **/
const getResolver = ({ modelsMap }) => async function (name, parent = {}, args, { callback }) {
  args = args || {};

  // Introspection type name
  if (name === '__typename') {
    return typenameResolver({ parent });
  }

  // Top-level and non-top-level attributes are handled differently
  const subResolver = hasParentModel(parent) ? nestedModelResolver : topLevelModelResolver;
  // Retrieve main input passed to database layer
  const { multiple, modelName, opType, directReturn } = subResolver({ name, modelsMap, parent, args });
  // Shortcuts resolver if we already know the final result
  if (directReturn !== undefined) { return directReturn; }

  // Retrieve operation name, passed to database layer
  const { name: operation } = operations.find(op => op.multiple === multiple && op.opType === opType) || {};
  // This means the query specified an attribute that is not present in IDL definition
  if (operation == null || modelName == null) {
    throw new EngineError(`Operation '${name}' does not exist`, { reason: 'INPUT_VALIDATION' });
  }

  // Fire database layer, retrieving value passed to children
  const response = await callback({ operation, modelName, args });
  // Tags the response as belonging to that modelName
  setParentModel(response, { operation, modelName, opType });
  return response;
};


module.exports = {
  getResolver,
};
