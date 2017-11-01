'use strict';

const { pick } = require('../../../utilities');

const { getCurrentData } = require('./current_data');
const { removeDuplicates } = require('./duplicate');

// Merge arguments and retrieve model ids
const getArgs = function ({ actions, top: { command, args: topArgs } }) {
  const { args, ids } = command.type === 'delete'
    ? useCurrentData({ actions })
    : useNewData({ actions });

  const argsA = applyTopArgs({ args, topArgs });

  const currentData = getCurrentData({ actions, ids });
  const argsB = { ...argsA, currentData };

  return { args: argsB, ids };
};

// Merge all `args.data` into `newData`, for `replace|patch|create` commands
const useNewData = function ({ actions }) {
  const models = getModels(actions, ({ args: { data } }) => data);

  const ids = models.map(({ id }) => id);

  return { args: { newData: models }, ids };
};

// Merge all `currentData` into `filter.id`, for `delete` command
const useCurrentData = function ({ actions }) {
  const models = getModels(actions, ({ currentData }) => currentData);

  const ids = models.map(({ id }) => id);

  return { args: { deletedIds: ids }, ids };
};

const getModels = function (actions, getModel) {
  const models = actions.map(getModel);
  const modelsA = removeDuplicates(models);
  return modelsA;
};

// Reuse some whitelisted top-level arguments
const applyTopArgs = function ({ args, topArgs }) {
  const topArgsA = pick(topArgs, ['dryrun']);
  return { ...topArgsA, ...args };
};

module.exports = {
  getArgs,
};
