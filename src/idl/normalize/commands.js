'use strict';


// Normalize `commands` shortcuts, e.g. 'read' -> 'readOne' + 'readMany'
const normalizeCommands = function ({ idl }) {
  idl.commands = normalizeCommandNames(idl.commands || defaultCommandNames);
  return idl;
};

const normalizeCommandNames = function (commandNames) {
  return commandNames.reduce((memo, commandName) => {
    const normalizedCommandName = /(One)|(Many)$/.test(commandName)
      ? [commandName]
      : [`${commandName}One`, `${commandName}Many`];
    return [...memo, ...normalizedCommandName];
  }, []);
};

// By default, include all commandNames but deleteMany
const defaultCommandNames = [
  'createOne',
  'createMany',
  'readOne',
  'readMany',
  'updateOne',
  'updateMany',
  'deleteOne',
];


module.exports = {
  normalizeCommands,
  normalizeCommandNames,
};
