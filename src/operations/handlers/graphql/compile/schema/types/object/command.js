'use strict';

const { mapValues } = require('../../../../../../../utilities');
const { getCommand } = require('../../../../../../../constants');

// Nested attributes change current command
const addCommands = function ({ fields, parentDef }) {
  return mapValues(fields, def => addCommand({ def, parentDef }));
};

const addCommand = function ({ def, parentDef }) {
  if (def.command) { return def; }

  if (!def.target) {
    return { ...def, command: parentDef.command };
  }

  const command = getCommand({
    commandType: parentDef.command.type,
    multiple: def.isArray,
  });
  return { ...def, command };
};

module.exports = {
  addCommands,
};
