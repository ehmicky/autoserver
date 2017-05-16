'use strict';


const { getFindInput } = require('./find');
const { getUpdateInput } = require('./update');


/**
 * "update" action is split into two database actions:
 *   - first a "find" database action retrieving current models
 *     Pagination is disabled for that query.
 *   - then a "update" database action using a merge of the update data and
 *     the current models
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
const updateAction = async function () {
  return async function updateAction(input) {
    const { actionType, action, modelName } = input;

    if (actionType === 'update') {
      const prefix = `In action '${action}', model '${modelName}',`;
      const response = await performUpdate.call(this, { input, prefix });
      return response;
    }

    const response = await this.next(input);
    return response;
  };
};

// Perform a find database action, followed by an update database action
const performUpdate = async function ({ input, prefix }) {
  const findInput = getFindInput({ input });
  const { data: models } = await this.next(findInput);

  const updateInput = getUpdateInput({ input, models, prefix });
  const response = await this.next(updateInput);

  return response;
};


module.exports = {
  updateAction,
};
