'use strict';

const { throwError } = require('../../../error');

const validateSelectPart = function ({ select, commandpath, key }) {
  if (commandpath && key) { return; }

  const message = `In argument 'select', '${select}' is invalid`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const validateSelect = function ({ actions, top: { command } }) {
  if (command.type === 'find') { return; }

  actions.forEach(action => validateAction({ action, command }));
};

// Write actions can only select attributes that are part of the write action
// itself, i.e. in `args.data|cascade`.
// Otherwise, this would require performing extra find actions.
const validateAction = function ({
  action: { isWrite, commandpath },
  command,
}) {
  if (isWrite || commandpath.length <= 1) { return; }

  const path = commandpath.slice(1).join('.');
  const argName = command.type === 'delete' ? 'cascade' : 'data';
  const message = `Can only 'select' attribute '${path}' if it is specified in '${argName}' argument`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  validateSelectPart,
  validateSelect,
};
