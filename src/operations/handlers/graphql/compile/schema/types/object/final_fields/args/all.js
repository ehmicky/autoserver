'use strict';

const { getDataArgument } = require('./data');
const { getFilterArgument } = require('./filter');
const { getOrderArgument } = require('./order');
const { getPaginationArgument } = require('./pagination');
const { getSilentArgument } = require('./silent');
const { getDryrunArgument } = require('./dryrun');
const { getCascadeArgument } = require('./cascade');

// Retrieves all resolver arguments, before resolve function is fired
const getArgs = function (def, opts) {
  // Only for top-level actions
  const isTopLevel = ['Query', 'Mutation'].includes(opts.parentDef.model);
  if (!isTopLevel) { return; }

  const optsA = getArgTypes(def, opts);

  return {
    ...getDataArgument(def, optsA),
    ...getFilterArgument(def, optsA),
    ...getOrderArgument(def, optsA),
    ...getPaginationArgument(def, optsA),
    ...getSilentArgument(def, optsA),
    ...getDryrunArgument(def, optsA),
    ...getCascadeArgument(def, optsA),
  };
};

// Builds types used for `data` and `filter` arguments
const getArgTypes = function (def, opts) {
  const { getType } = opts;
  const dataObjectType = getType(def, { ...opts, inputObjectType: 'data' });
  const filterObjectType = getType(def, { ...opts, inputObjectType: 'filter' });
  return { ...opts, dataObjectType, filterObjectType };
};

module.exports = {
  getArgs,
};
