'use strict';

const { isEqual } = require('lodash');

const { assignArray } = require('../../../utilities');
const { getCommand } = require('../../../constants');
const { getSimpleFilter } = require('../../../database');

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
  action: { commandPath, command: { type: commandType, multiple } },
  top,
}) {
  const isTopLevel = isEqual(top.commandPath, commandPath);

  if (!isTopLevel) {
    return commandType === 'find' ? [action] : [];
  }

  // Transform write actions into read actions
  const command = getCommand({ commandType: 'find', multiple });

  const filter = getTopLevelFilter({ action });

  return [{
    ...action,
    command,
    args: { ...action.args, filter },
  }];
};

// For `currentData` query:
//   - create `args.filter`.
//     It will use the `filter` from delete|patch.
// For selection query:
//   - if write actions were fired, reuse their result in `args.filter`,
//     for efficiency.
//     It will reuse `currentData` from replace|delete|patch,
//     `data` from create, and `filter` from find.
const getTopLevelFilter = function ({ action, action: { args: { filter } } }) {
  const models = getModels({ action });

  if (models === undefined) { return filter; }

  const ids = models.map(({ id }) => id);
  const filterA = getSimpleFilter({ ids });
  return filterA;
};

const getModels = function ({ action: { currentData, args: { data } } }) {
  if (currentData) { return currentData; }

  // Use replace|create `data`, but not patch `data`
  const hasDataIds = data && data.every(datum => datum.id !== undefined);
  if (hasDataIds) { return data; }
};

module.exports = {
  getReadActions,
};
