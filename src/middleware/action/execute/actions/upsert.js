'use strict';

const { getFilter } = require('../filter');

// Goal is to check whether models exist, so we know if "upsert" action
// will create or update models.
// The "real" commands are "create" and "update".
// The first and second "find" commands are just here to patch things up,
// and do not provide extra information to consumers, so should be
// transparent when it comes to pagination and authorization
const firstReadCommand = ({ args: { data: argData } }) => ({
  command: 'read',
  args: {
    filter: getFilter({ argData }),
    pagination: false,
    authorization: false,
  },
});

const createCommand = (input, data) => ({
  command: 'create',
  args: {
    pagination: false,
    newData: getCreateModels({ input, data }),
  },
});

// First check if models exist or not, by performing a "read" command
// If models do not exist, create them with "create" command
// If models exist, update them with "update" command
// Finally, retrieve output with a second "read" command
const shouldCreate = ({ input, data }) =>
  isDefined({ models: getCreateModels({ input, data }) });

const updateCommand = function (input, models) {
  const newData = getUpdateModels({ input, data: models });
  return {
    command: 'update',
    args: {
      pagination: false,
      currentData: getCurrentData({ dataArg: newData, models }),
      newData,
    },
  };
};

const shouldUpdate = ({ input, data }) =>
  isDefined({ models: getUpdateModels({ input, data }) });

// Final output
const secondReadCommand = ({ args: { data: argData } }) => ({
  command: 'read',
  args: {
    filter: getFilter({ argData }),
    pagination: false,
    authorization: false,
  },
});

// If there no models to create or update, avoid performing a database command
const isDefined = function ({ models }) {
  if (!models) { return false; }

  if (Array.isArray(models)) {
    return models.length > 0;
  }

  if (models.constructor === Object) { return true; }

  return false;
};

const getCurrentData = function ({ dataArg, models }) {
  if (!Array.isArray(models)) { return models; }

  return dataArg.map(newDatum => {
    const currentDatum = models.find(model => model.id === newDatum.id);
    return currentDatum || null;
  });
};

// Check among args.data which ones exist or not, using the result
// of the first "read" command
const getCreateModels = function ({ input: { args: { data } }, data: models }) {
  if (Array.isArray(data)) {
    const modelsIds = models.map(({ id }) => id);
    return data.filter(({ id }) => !modelsIds.includes(id));
  }

  if (models.id === data.id) { return []; }

  return data;
};

const getUpdateModels = function ({ input: { args: { data } }, data: models }) {
  if (Array.isArray(data)) {
    const modelsIds = models.map(({ id }) => id);
    return data.filter(({ id }) => modelsIds.includes(id));
  }

  if (models.id === data.id) { return data; }

  return [];
};

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
const upsertAction = [
  { input: firstReadCommand },
  [
    { input: createCommand, test: shouldCreate },
    { input: updateCommand, test: shouldUpdate },
  ],
  { input: secondReadCommand },
];

module.exports = {
  upsert: upsertAction,
};
