'use strict';

const { omit } = require('../../utilities');
const { extractSimpleIds } = require('../../filter');

// Fire the actual command
const fireReadCommand = async function ({
  action: { commandPath, modelName },
  mInput,
  nextLayer,
  command,
  args,
}) {
  const emptyCommand = isEmptyCommand({ args });
  if (emptyCommand) { return []; }

  const argsA = omit(args, 'data');

  const mInputA = {
    ...mInput,
    commandPath: commandPath.join('.'),
    modelName,
    args: argsA,
    command: command.type,
  };

  const { response: { data: result } } = await nextLayer(mInputA, 'command');
  return result;
};

// When parent value is not defined, directly returns empty value
const isEmptyCommand = function ({ args }) {
  const ids = extractSimpleIds(args);
  return Array.isArray(ids) && ids.length === 0;
};

module.exports = {
  fireReadCommand,
};
