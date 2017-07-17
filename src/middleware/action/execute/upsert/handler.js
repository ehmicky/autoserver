'use strict';

const { getFirstReadInput } = require('./first_read');
const { getCreateInput } = require('./create');
const { getUpdateInput } = require('./update');
const { getSecondReadInput } = require('./second_read');

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
 *     parameter. Example: created_time should be set if upsert creates a model,
 *     but not if it updates it.
 **/
const upsertAction = async function (input) {
  const { log } = input;
  const perf = log.perf.start('action.upsert', 'middleware');

  // First check if models exist or not, by performing a "read" command
  const firstReadInput = getFirstReadInput({ input });

  perf.stop();
  const { data: models } = await this.next(firstReadInput);
  perf.start();

  const { createModels, updateModels } = splitModels({ input, models });

  // If models do not exist, create them with "create" command
  if (isDefined({ models: createModels })) {
    const createInput = getCreateInput({ input, data: createModels });

    perf.stop();
    await this.next(createInput);
    perf.start();
  }

  // If models exist, update them with "update" command
  if (isDefined({ models: updateModels })) {
    const updateInput = getUpdateInput({ input, data: updateModels, models });

    perf.stop();
    await this.next(updateInput);
    perf.start();
  }

  // Finally, retrieve output with a second "read" command
  const secondReadInput = getSecondReadInput({ input });

  perf.stop();
  const response = await this.next(secondReadInput);

  return response;
};

// Check among args.data which ones exist or not, using the result
// of the first "read" command
const splitModels = function ({ input: { args: { data } }, models }) {
  const modelsIds = models.map(({ id }) => id);

  if (Array.isArray(data)) {
    const createModels = data.filter(({ id }) => !modelsIds.includes(id));
    const updateModels = data.filter(({ id }) => modelsIds.includes(id));
    return { createModels, updateModels };
  } else if (modelsIds.includes(data.id)) {
    return { createModels: [], updateModels: data };
  }

  return { createModels: data, updateModels: [] };
};

// If there no models to create or update, avoid performing a database command
const isDefined = function ({ models }) {
  if (!models) { return false; }

  if (Array.isArray(models)) {
    return models.length > 0;
  } else if (models.constructor === Object) {
    return true;
  }
};

module.exports = {
  upsertAction,
};
