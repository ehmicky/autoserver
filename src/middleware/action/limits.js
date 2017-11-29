'use strict';

const pluralize = require('pluralize');

const { getWordsList } = require('../../utilities');
const { throwError } = require('../../error');
const { getLimits } = require('../../limits');

// Validate request limits
const validateRequestLimits = function ({ runOpts, mInput }) {
  const limits = getLimits({ runOpts });

  validators.forEach(validator => validator({ ...mInput, limits }));
};

const validateMaxDepth = function ({ limits: { maxDepth }, actions }) {
  const tooNestedActions = actions
    .filter(({ commandpath }) => commandpath.length > maxDepth);
  if (tooNestedActions.length === 0) { return; }

  const paths = tooNestedActions
    .map(({ commandpath }) => commandpath.slice(1).join('.'));
  const pathsA = getWordsList(paths, { op: 'and', quotes: true });
  const message = `The following ${pluralize('command', paths.length)} ${pluralize('is', paths.length)} nested too deeply: ${pathsA}. The maximum depth level for commands is ${maxDepth}`;
  throwError(message, { reason: 'REQUEST_LIMIT' });
};

const validators = [
  validateMaxDepth,
];

module.exports = {
  validateRequestLimits,
};
