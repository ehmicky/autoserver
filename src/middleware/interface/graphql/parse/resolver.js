'use strict';


const { findOperations } = require('./models');
const { getArguments } = require('./arguments');


// Gets a resolver (and args) to add to a GraphQL field
const getResolver = function ({ def, multiple, getType, opts }) {
	// Only for top-level models, and not for argument types
  if (!def.model || opts.isInputObject) { return; }

  const opType = opts.opType;
  const operation = findOperations({ opType, multiple });
	const resolve = async function (_, args, { callback }) {
    return await executeOperation({ operation, args, callback });
  };

	const args = getArguments({ multiple, def, getType, typeOpts: opts });

  return { args, resolve };
};

const executeOperation = async function ({ operation, args = {}, callback }) {
  const response = await callback({ operation, args });
  return response;
};


module.exports ={
	getResolver,
};