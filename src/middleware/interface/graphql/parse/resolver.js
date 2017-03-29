'use strict';


const { findOperations } = require('./models');
const { getArguments, addArguments } = require('./arguments');
const { isMultiple, isModel } = require('./utilities');


// Gets a resolver (and args) to add to a GraphQL field
const getResolver = function (def, opts) {
	// Only for top-level models, and not for argument types
  if (!isModel(def) || opts.inputObjectType) { return; }

  const resolve = getResolveFunc(def, opts);
	const args = getArguments(def, opts);
  return { args, resolve };
};

const getResolveFunc = function (def, opts) {
  const operation = findOperations({ opType: opts.opType, multiple: isMultiple(def) });

	return async function (parentVal, args, { callback }, { parentType: { def: parentDef } }) {
    const parent = { def: parentDef, val: parentVal };
    addArguments(def, { args, opType: opts.opType, parent });
    return await executeOperation({ operation, args, callback });
  };
};

// Fires an operation in the database layer
const executeOperation = async function ({ operation, args = {}, callback }) {
  const response = await callback({ operation, args });
  return response;
};


module.exports = {
  getResolver,
};