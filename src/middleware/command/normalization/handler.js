'use strict';

const { normalizeFilter } = require('./filter');
const { normalizeOrderBy } = require('./order_by');

/**
 * Normalize input, i.e. when input can take several shapes,
 * reduce it to a single shape
 **/
const normalization = async function (nextFunc, input) {
  const {
    args,
    args: { orderBy, filter },
    modelName,
    idl: { models },
  } = input;

  const argsA = { ...args };

  if (filter) {
    argsA.nFilter = normalizeFilter({ filter });
  }

  if (orderBy) {
    const attrNames = Object.keys(models[modelName].properties);
    argsA.nOrderBy = normalizeOrderBy({ orderBy, attrNames });
  }

  const inputA = { ...input, args: argsA };

  const response = await nextFunc(inputA);
  return response;
};

module.exports = {
  normalization,
};
