'use strict';

const { renameThis } = require('../rename_this');

const { getFirstReadInput } = require('./first_read');
const { getCreateInput } = require('./create');
const { getUpdateInput } = require('./update');
const { getSecondReadInput } = require('./second_read');
const { getCreateModels, getUpdateModels } = require('./split');

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
  const response = await renameThis.call(this, { input, actions });
  return response;
};

// First check if models exist or not, by performing a "read" command
// If models do not exist, create them with "create" command
// If models exist, update them with "update" command
// Finally, retrieve output with a second "read" command
const shouldCreate = function ({ input, data }) {
  const models = getCreateModels({ input, data });
  return isDefined({ models });
};

const shouldUpdate = function ({ input, data }) {
  const models = getUpdateModels({ input, data });
  return isDefined({ models });
};

// If there no models to create or update, avoid performing a database command
const isDefined = function ({ models }) {
  if (!models) { return false; }

  if (Array.isArray(models)) {
    return models.length > 0;
  }

  if (models.constructor === Object) { return true; }

  return false;
};

const actions = [
  {
    input: getFirstReadInput,
  },
  [
    {
      input: getCreateInput,
      test: shouldCreate,
    },
    {
      input: getUpdateInput,
      test: shouldUpdate,
    },
  ],
  {
    input: getSecondReadInput,
  },
];

module.exports = {
  upsertAction,
};
