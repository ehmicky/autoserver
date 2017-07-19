'use strict';

const { normalizeFilter } = require('./filter');
const { normalizeOrderBy } = require('./order_by');

/**
 * Normalize input, i.e. when input can take several shapes,
 * reduce it to a single shape
 **/
const normalization = async function (input) {
  const { args, modelName, idl: { models } } = input;
  const { orderBy, filter } = args;

  const newArgs = Object.assign({}, args);

  if (filter) {
    newArgs.nFilter = normalizeFilter({ filter });
  }

  if (orderBy) {
    const attrNames = Object.keys(models[modelName].properties);
    newArgs.nOrderBy = normalizeOrderBy({ orderBy, attrNames });
  }

  input.args = newArgs;

  const response = await this.next(input);
  return response;
};

module.exports = {
  normalization,
};
