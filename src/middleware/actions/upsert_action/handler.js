'use strict';


const { performUpsert } = require('./upsert');


/**
 * "upsert" action is split into three commands:
 *   - first a "read" command checking whether models exist
 *     Pagination is disabled for that query.
 *   - then, for each model that does not exist, a "create" command
 *   - then, for each model that exists, an "update" command
 *   - then, a final "read" command for the final result.
 *     We need that final command to bring the "create" and "update" output
 *     results together, sorted and paginated.
 * The reasons why we split "upsert" action are:
 *   - expose only simple CRUD commands ("create", "read", "update", "delete")
 *     to next layers
 *   - allow next layers to distinguish between an upsert action that creates
 *     a model, and one that updates a model.
 *     E.g. transforms might need to know this information using $COMMAND
 *     variable. Example: created_time should be set if upsert creates a model,
 *     but not if it updates it.
 **/
const upsertAction = async function () {
  return async function upsertAction(input) {
    const { action, modelName } = input;

    if (action.type === 'upsert') {
      const prefix = `In action '${action.name}', model '${modelName}',`;
      const response = await performUpsert.call(this, { input, prefix });
      return response;
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  upsertAction,
};
