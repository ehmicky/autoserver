'use strict';

const { isEqual } = require('lodash');

const { assignArray } = require('../../../utilities');
const { getCommand } = require('../../../constants');
const { getSimpleFilter } = require('../../../filter');

// `currentData` query only fire top-level write action, transformed to a read
// action.
// Otherwise, only `find` actions are triggered.
// Also create a normalized top-level `args.filter`
const getReadActions = function ({ actions, top }) {
  return actions
    .map(action => getReadAction({ action, top }))
    .reduce(assignArray, []);
};

const getReadAction = function ({
  action,
  action: {
    args,
    commandPath,
    command: { type: commandType, multiple },
    currentData,
  },
  top,
}) {
  const isTopLevel = isEqual(top.commandPath, commandPath);

  if (!isTopLevel) {
    return commandType === 'find' ? [action] : [];
  }

  // Transform write actions into read actions
  const command = getCommand({ commandType: 'find', multiple });
  const filter = getTopLevelFilter({ args, currentData, top });
  const argsA = { ...args, filter };

  return [{ ...action, command, args: argsA }];
};

// For `currentData` query:
//   - create `args.filter`.
//     It will use the `filter` from delete|patch.
// For selection query:
//   - if write actions were fired, reuse their result in `args.filter`,
//     for efficiency.
//     It will reuse `currentData` from replace|delete|patch,
//     `data` from create, and `filter` from find.
const getTopLevelFilter = function ({
  args,
  args: { filter },
  currentData,
  top,
}) {
  const models = getModels({ args, currentData, top });

  if (models === undefined) { return filter; }

  const ids = models.map(({ id }) => id);
  const filterA = getSimpleFilter({ ids });
  return filterA;
};

const getModels = function ({ args: { data }, currentData, top }) {
  if (currentData && top.command.type !== 'create') { return currentData; }

  // Use replace|create `data`, but not patch `data`
  const hasDataIds = data && data.every(({ id }) => id !== undefined);
  if (hasDataIds) { return data; }
};

module.exports = {
  getReadActions,
};
