'use strict';

const { uniq } = require('../../../utilities');
const { throwError } = require('../../../error');
const { addToActions } = require('../add_actions');

// Parse `args.rename` for each action
const parseRename = function ({ actions, top }) {
  const actionsA = addToActions({
    actions,
    name: 'rename',
    filter: ['rename'],
    mapper: getRenameArg,
    top,
  });

  return { actions: actionsA };
};

const getRenameArg = function ({ action: { args: { rename }, commandpath } }) {
  const renamesA = rename.split(',');
  const renamesB = uniq(renamesA);
  const renamesC = renamesB
    .map(renameA => getRenamePart({ rename: renameA, commandpath }));
  return renamesC;
};

// Turns `args.rename` 'aaa.bbb.ccc:ddd' into:
// `commandpath` 'aaa.bbb', `key` 'ccc', `outputName` 'ddd']
const getRenamePart = function ({ rename, commandpath }) {
  const renameA = [...commandpath, rename].join('.');
  const [, commandpathA, outputName] = RENAME_REGEXP.exec(renameA) || [];

  if (!commandpathA || !outputName) {
    const message = `In 'rename' argument, '${rename}' is invalid`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  const commandpathB = commandpathA.split('.');
  const commandpathC = commandpathB.slice(0, -1).join('.');
  const key = commandpathB[commandpathB.length - 1];

  return { [commandpathC]: { key, outputName } };
};

const RENAME_REGEXP = /^(.+):([^:]+)$/;

module.exports = {
  parseRename,
};
