'use strict';


const { getArguments } = require('./arguments');
const { isModel } = require('./utilities');


// Gets a resolver (and args) to add to a GraphQL field
const getResolver = function (def, opts) {
	// Only for top-level models, and not for argument types
  if (!isModel(def) || opts.inputObjectType || def.noResolve) { return; }

	const args = getArguments(def, opts);
  return { args };
};


module.exports = {
  getResolver,
};
