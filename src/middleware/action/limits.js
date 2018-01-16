'use strict';

const pluralize = require('pluralize');

const { getWordsList, flatten } = require('../../utilities');
const { throwError } = require('../../errors');
const { getLimits } = require('../../limits');

const { getColl } = require('./get_coll');

// Validate request limits
const validateRequestLimits = function ({ config, mInput }) {
  const limits = getLimits({ config });

  validators.forEach(validator => validator({ ...mInput, limits }));
};

const validateMaxActions = function ({ limits: { maxActions }, actions }) {
  if (actions.length <= maxActions) { return; }

  const message = `The request must contain less than ${maxActions - 1} nested commands, but there are ${actions.length - 1} of them`;
  throwError(message, { reason: 'PAYLOAD_LIMIT' });
};

// Nested patch|create|upsert commands use `maxmodels` instead
// Nested delete commands are not limited, as they are meant not to be performed
// several times
const validateNestedFind = function ({ limits, actions, top, config }) {
  if (top.command.type !== 'find') { return; }

  const tooNestedActions = actions
    .filter(action => isTooNestedFind({ action, config, top, limits }));
  if (tooNestedActions.length === 0) { return; }

  const paths = tooNestedActions
    .map(({ commandpath }) => commandpath.join('.'));
  const pathsA = getWordsList(paths, { op: 'and', quotes: true });
  const message = `The following ${pluralize('command', paths.length)} ${pluralize('is', paths.length)} nested too deeply: ${pathsA}. 'find' commands can only target collections at the top level or the second level.`;
  throwError(message, { reason: 'PAYLOAD_LIMIT' });
};

const isTooNestedFind = function ({
  action: { commandpath },
  config,
  top,
  limits: { maxFindManyDepth },
}) {
  if (commandpath.length < maxFindManyDepth) { return false; }

  const { multiple } = getColl({ commandpath, top, config });
  return multiple;
};

// Validate `args.data` against `maxmodels` limit
const validateMaxData = function ({
  actions,
  limits: { maxmodels },
  top: { command },
}) {
  // Not applied to:
  //  - find|patch commands: applied later since response size is not known yet
  //  - delete commands: they are never limited
  if (!MAX_DATA_COMMANDS.includes(command.type)) { return; }

  const dataA = actions.map(({ args: { data } }) => data);
  const dataB = flatten(dataA);

  if (dataB.length <= maxmodels) { return; }

  const message = `The 'data' argument must not contain more than ${maxmodels} models, but it contains ${dataB.length} models, including nested models`;
  throwError(message, { reason: 'PAYLOAD_LIMIT' });
};

const MAX_DATA_COMMANDS = ['create', 'upsert'];

const validators = [
  validateMaxActions,
  validateNestedFind,
  validateMaxData,
];

module.exports = {
  validateRequestLimits,
};
