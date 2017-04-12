'use strict';


const { operations } = require('../../../../../idl');
const { EngineError } = require('../../../../../error');
const { typenameResolver } = require('./typename');
const { attrResolver } = require('./attr');
const { nestedModelResolver } = require('./nested_model');
const { topLevelModelResolver } = require('./top_level_model');
const { parseName, setParentModel, hasParentModel } = require('./utilities');


/**
 * GraphQL-anywhere uses a single resolver: here it is
 **/
const getResolver = ({ modelsMap }) => async function (name, parent = {}, args, { callback }) {
  args = args || {};

  // Introspection type name
  if (name === '__typename') {
    return typenameResolver({ parent });
  }

  const { attrName, opType } = parseName({ name });

  // If the attribute name does not conform the `findModel[s]` convention,
  // it is a normal attribute which just returns its parent value
  if (!attrName || !opType) {
    return attrResolver({ name, parent });
  }

  // Top-level and non-top-level attributes are handled differently
  const subResolver = hasParentModel(parent) ? nestedModelResolver : topLevelModelResolver;
  // Retrieve main input passed to database layer
  const { multiple, modelName, extraArgs, directReturn } = subResolver({ attrName, modelsMap, parent, args });
  // Shortcuts resolver if we already know the final result
  if (directReturn !== undefined) { return directReturn; }
  // This means the query specified an attribute that is not present in IDL definition
  if (multiple == null || modelName == null) {
    throw new EngineError(`Operation '${name}' does not exist`, { reason: 'INPUT_VALIDATION' });
  }
  const finalArgs = Object.assign({}, args, extraArgs);

  // Retrieve operation name, passed to database layer
  const { name: operation } = operations.find(op => op.multiple === multiple && op.opType === opType);

  // Fire database layer, retrieving value passed to children
  const response = await callback({ operation, modelName, args: finalArgs });
  // Tags the response as belonging to that modelName
  setParentModel(response, { operation, modelName, opType });
  return response;
};


module.exports = {
  getResolver,
};
