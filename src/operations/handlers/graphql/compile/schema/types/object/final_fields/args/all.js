'use strict';

const { getDataArgument } = require('./data');
const { getFilterArgument } = require('./filter');
const { getOrderArgument } = require('./order');
const { getPaginationArgument } = require('./pagination');

// Retrieves all resolver arguments, before resolve function is fired
const getArgs = function ({ parentDef, def, opts }) {
  // Only for top-level actions
  const noArgs = !['Query', 'Mutation'].includes(parentDef.model);
  if (noArgs) { return; }

  const argTypes = getArgTypes({ def, opts });
  const optsA = { ...opts, ...argTypes, def };

  return {
    ...getDataArgument(optsA),
    ...getFilterArgument(optsA),
    ...getOrderArgument(optsA),
    ...getPaginationArgument(optsA),
  };
};

// Builds types used for `data` and `filter` arguments
const getArgTypes = function ({ def, opts }) {
  const defA = { ...def, arrayWrapped: true };

  console.log(opts.defName);
  const dataObjectType = opts.getType(defA, {
    ...opts,
    inputObjectType: 'data',
  });
  const filterObjectType = opts.getType(defA, {
    ...opts,
    inputObjectType: 'filter',
  });

  return { dataObjectType, filterObjectType };
};

module.exports = {
  getArgs,
};
