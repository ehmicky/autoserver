'use strict';


const { operations } = require('../../../../idl');
const { getArguments, addArguments } = require('./arguments');
const { isMultiple, isModel, getModelName } = require('./utilities');


// Gets a resolver (and args) to add to a GraphQL field
const getResolver = function (def, opts) {
	// Only for top-level models, and not for argument types
  if (!isModel(def) || opts.inputObjectType || def.noResolve) { return; }

  const resolve = getResolveFunc(def, opts);
	const args = getArguments(def, opts);
  return { args, resolve };
};

const getResolveFunc = function (def, opts) {
  const multiple = isMultiple(def);
  const opType = opts.opType;
  const operation = operations.find(operation => operation.opType === opType && operation.multiple == multiple);

	return async function (parentVal, args, { callback }, { parentType: { def: parentDef } }) {
    const parent = { def: parentDef, val: parentVal };
    const returnValue = addArguments(def, { args, opType, multiple, parent });
    if (returnValue !== undefined) { return returnValue; }

    const modelName = getModelName(def);
    return await executeOperation({ operation: operation.name, args, modelName, callback });
  };
};

// Fires an operation in the database layer
const executeOperation = async function ({ operation, args = {}, modelName, callback }) {
  const response = await callback({ operation, args, modelName });
  return response;
};


module.exports = {
  getResolver,
};
