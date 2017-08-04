'use strict';

const { getDataArgument } = require('./data');
const { getFilterArgument } = require('./filter');
const { getOrderArgument } = require('./order');
const { getPaginationArgument } = require('./pagination');

const getArgs = function ({ def, opts }) {
  // Only for models, and not for argument types
  const noArgs = def.model === undefined || opts.inputObjectType !== undefined;
  if (noArgs) { return; }

  const argTypes = getArgTypes({ def, opts });
  const options = { ...opts, ...argTypes, def };

  // Retrieves all resolver arguments, before resolve function is fired
  return {
    ...getDataArgument(options),
    ...getFilterArgument(options),
    ...getOrderArgument(options),
    ...getPaginationArgument(options),
  };
};

// Builds types used for `data` and `filter` arguments
const getArgTypes = function ({ def, opts }) {
  const defA = { ...def, arrayWrapped: true };
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
