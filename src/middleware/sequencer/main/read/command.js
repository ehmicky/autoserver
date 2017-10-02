'use strict';

const { omit } = require('../../../../utilities');

// Fire the actual command
const fireReadCommand = async function ({
  action: { commandPath, modelName, internal = false },
  mInput,
  nextLayer,
  command,
  args,
  args: { filter: { id: ids } = {} },
}) {
  // When parent value is not defined, directly returns empty value
  if (Array.isArray(ids) && ids.length === 0) { return []; }

  const argsA = { ...args, internal };
  const argsB = omit(argsA, 'data');

  const mInputA = {
    ...mInput,
    commandPath: commandPath.join('.'),
    modelName,
    args: argsB,
    command: command.type,
  };

  const { response: { data: result } } = await nextLayer(mInputA);
  return result;
};

module.exports = {
  fireReadCommand,
};
