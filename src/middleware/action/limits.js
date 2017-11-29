'use strict';

const pluralize = require('pluralize');

const { getWordsList } = require('../../utilities');
const { throwError } = require('../../error');
const { getLimits } = require('../../limits');

const { getColl } = require('./get_coll');

// Validate request limits
const validateRequestLimits = function ({ runOpts, mInput }) {
  const limits = getLimits({ runOpts });

  validators.forEach(validator => validator({ ...mInput, limits }));
};

const validateMaxDepth = function ({ limits: { maxDepth }, actions }) {
  const tooNestedActions = actions
    .filter(({ commandpath }) => commandpath.length > maxDepth);
  if (tooNestedActions.length === 0) { return; }

  const message = `The maximum depth level for commands is ${maxDepth}`;
  throwNestingError({ actions: tooNestedActions, message });
};

// Nested patch|create|upsert commands use `maxmodels` instead
// Nested delete commands are not limited, as they are meant not to be performed
// several times
const validateNestedFind = function ({ limits, actions, top, schema }) {
  if (top.command.type !== 'find') { return; }

  const tooNestedActions = actions
    .filter(action => isTooNestedFind({ action, schema, top, limits }));
  if (tooNestedActions.length === 0) { return; }

  const message = '\'find\' commands can only target collections at the top level or the second level.';
  throwNestingError({ actions: tooNestedActions, message });
};

const isTooNestedFind = function ({
  action: { commandpath },
  schema: { shortcuts: { collsMap } },
  top,
  limits: { maxFindManyDepth },
}) {
  if (commandpath.length <= maxFindManyDepth) { return false; }

  const { multiple } = getColl({ commandpath, collsMap, top });
  return multiple;
};

const throwNestingError = function ({ actions, message }) {
  const paths = actions
    .map(({ commandpath }) => commandpath.slice(1).join('.'));
  const pathsA = getWordsList(paths, { op: 'and', quotes: true });
  const messageA = `The following ${pluralize('command', paths.length)} ${pluralize('is', paths.length)} nested too deeply: ${pathsA}. ${message}`;
  throwError(messageA, { reason: 'REQUEST_LIMIT' });
};

const validators = [
  validateMaxDepth,
  validateNestedFind,
];

module.exports = {
  validateRequestLimits,
};
