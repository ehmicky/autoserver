'use strict';

const { difference, getWordsList } = require('../../../utilities');
const { throwError } = require('../../../error');

const validateSelectPart = function ({ select, commandpath, key }) {
  if (commandpath && key) { return; }

  const message = `In 'select' argument, '${select}' is invalid`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

// Validate we are selecting attributes in actions that are present|populated
const validateSelects = function ({ actions, selects, top }) {
  const actionPaths = actions
    .map(({ commandpath }) => getCommandpath(commandpath));
  const selectPaths = selects
    .map(({ commandpath }) => getCommandpath(commandpath.split('.')));
  const wrongPaths = difference(selectPaths, actionPaths);
  if (wrongPaths.length === 0) { return; }

  const wrongPathsA = getWordsList(wrongPaths, { op: 'and', quotes: true });
  const relatedArg = RELATED_ARG[top.command.type];
  const message = `In 'select' argument, must not specify ${wrongPathsA} unless it is also specified in argument '${relatedArg}'`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const getCommandpath = function (commandpath) {
  return commandpath.slice(1).join('.');
};

// Cannot select an attribute unless it's already populated by one of the
// following arguments
const RELATED_ARG = {
  find: 'populate',
  delete: 'cascade',
  patch: 'data',
  create: 'data',
  upsert: 'data',
};

module.exports = {
  validateSelectPart,
  validateSelects,
};
