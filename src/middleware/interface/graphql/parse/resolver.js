'use strict';


const { findOperations } = require('./models');
const { getArguments } = require('./arguments');
const { isMultiple, getSubDef, isModel } = require('./utilities');


// Gets a resolver (and args) to add to a GraphQL field
const getResolver = function (def, opts) {
	// Only for top-level models, and not for argument types
  if (!isModel(def) || opts.isInputObject) { return; }

  const multiple = isMultiple(def);
  const opType = opts.opType;
  const operation = findOperations({ opType, multiple });
	const resolve = async function (_, args, { callback }) {
    return await executeOperation({ operation, args, callback });
  };

	// Builds inputObject type
  const subDef = getSubDef(def);
	const inputObjectOpts = Object.assign({}, opts, { isInputObject: true });
	const inputObjectType = opts.getType(subDef, inputObjectOpts);

	const args = getArguments({ multiple, opType: opts.opType, inputObjectType });

  return { args, resolve };
};

// Fires an operation in the database layer
const executeOperation = async function ({ operation, args = {}, callback }) {
  const response = await callback({ operation, args });
  return response;
};


module.exports = {
  getResolver,
};