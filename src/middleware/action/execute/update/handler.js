'use strict';

const { getReadInput } = require('./read');
const { getUpdateInput } = require('./update');

/**
 * "update" action is split into two commands:
 *   - first a "read" command retrieving current models
 *     Pagination is disabled for that query.
 *   - then a "update" command using a merge `newData` of the update data
 *     `args.data` and the current models `currentData`
 * The reasons why we split "update" action are:
 *   - we need to know the current models so we can:
 *      - apply JSL present in `args.data`
 *   - we need to know all the attributes of the current model so we can:
 *      - use `$$` in the JSL used in the next middlewares, including
 *        defaults and transforms
 *      - perform cross-attributes validation.
 *        E.g. if attribute `a` must be equal to attribute `b`, when we update
 *        `a`, we need to fetch `b` to check that validation rule.
 **/
const updateAction = async function (input) {
  const readInput = getReadInput({ input });
  const { data: models } = await this.next(readInput);

  const updateInput = getUpdateInput({ input, models });
  const response = await this.next(updateInput);

  return response;
};

module.exports = {
  updateAction,
};
