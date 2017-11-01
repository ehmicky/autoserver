'use strict';

const { throwError } = require('../../error');

// Validate `args.select`
const validateSelect = function ({ actions, top }) {
  actions.forEach(action => validateSelectAction({ action, top }));
};

// Write actions can only select attributes that are part of the write action
// itself, i.e. in `args.data|cascade`.
// Otherwise, this would require performing extra find actions.
const validateSelectAction = function ({
  action: { isWrite, commandPath },
  top: { command: { type: topCommand } },
}) {
  const isWrongSelect = topCommand !== 'find' &&
    !isWrite &&
    commandPath.length > 1;
  if (!isWrongSelect) { return; }

  const path = commandPath.slice(1).join('.');
  const argName = topCommand === 'delete' ? 'cascade' : 'data';
  const message = `Can only 'select' attribute '${path}' if it is specified in '${argName}' argument`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  validateSelect,
};
