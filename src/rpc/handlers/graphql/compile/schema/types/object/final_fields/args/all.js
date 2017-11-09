'use strict';

const { getArgTypeDescription } = require('../../../../description');

const { getDataArgument } = require('./data');
const { getFilterArgument } = require('./filter');
const { getIdArgument } = require('./id');
const { getOrderArgument } = require('./order');
const { getPaginationArgument } = require('./pagination');
const { getSilentArgument } = require('./silent');
const { getDryrunArgument } = require('./dryrun');
const { getCascadeArgument } = require('./cascade');
const { getParamsArgument } = require('./params');

// Retrieves all resolver arguments, before resolve function is fired
const getArgs = function (def, opts) {
  // Only for top-level actions
  const isTopLevel = ['Query', 'Mutation'].includes(opts.parentDef.collname);
  if (!isTopLevel) { return; }

  const optsA = getArgTypes(def, opts);

  return {
    ...getDataArgument(def, optsA),
    ...getFilterArgument(def, optsA),
    ...getIdArgument(def, optsA),
    ...getCascadeArgument(def, optsA),
    ...getOrderArgument(def, optsA),
    ...getPaginationArgument(def, optsA),
    ...getDryrunArgument(def, optsA),
    ...getSilentArgument(def, optsA),
    ...getParamsArgument(def, optsA),
  };
};

// Builds types used for `data` and `filter` arguments
const getArgTypes = function (def, opts) {
  const dataObjectType = getArgType(def, opts, 'data');
  const filterObjectType = getArgType(def, opts, 'filter');
  return { ...opts, dataObjectType, filterObjectType };
};

const getArgType = function (def, opts, inputObjectType) {
  const description = getArgTypeDescription(def, inputObjectType);
  const defA = { ...def, arrayWrapped: true, description };

  const { getType } = opts;
  const optsA = { ...opts, inputObjectType };

  return getType(defA, optsA);
};

module.exports = {
  getArgs,
};
