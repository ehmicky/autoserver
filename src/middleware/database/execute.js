'use strict';

// Fire actual database query
const databaseExecute = async function ({
  command,
  args,
  dryrun = {},
  modelName,
  dbAdapters,
}) {
  const { command: commandA, commandInput } = getCommandInput({
    command,
    args,
    dryrun,
    modelName,
  });

  const dbData = await queryDatabase({
    dbAdapters,
    modelName,
    command: commandA,
    commandInput,
    dryrun,
  });

  const response = getResponse({ dbData, args, command: commandA });
  return { response };
};

const getCommandInput = function ({
  command,
  args: {
    orderBy,
    limit,
    offset,
    newData,
    filter,
    deletedIds,
  },
  dryrun: { newInput = {} },
  modelName,
}) {
  const commandA = getCommand({ command, newInput });
  const filterA = newInput.filter || filter;

  const commandInput = {
    modelName,
    filter: filterA,
    deletedIds,
    newData,
    orderBy,
    limit,
    offset,
  };

  return { command: commandA, commandInput };
};

// `patch` command behaves like `replace`, so we simplify adapters here
const getCommand = function ({ command, newInput }) {
  if (newInput.command) { return newInput.command; }

  if (command === 'patch') { return 'replace'; }

  return command;
};

const queryDatabase = function ({
  dbAdapters,
  modelName,
  command,
  commandInput,
  dryrun: { noWrites },
}) {
  // `dryrun` middleware with create|replace|patch
  if (noWrites) { return; }

  return dbAdapters[modelName][command](commandInput);
};

const getResponse = function ({
  dbData,
  args: { currentData, newData },
  command,
}) {
  const dataInput = { dbData, newData, currentData };
  const data = dataInput[responseMap[command]];

  return { data };
};

// Only `find` command use database return value.
// `create` and `replace` assumes database does not modify input, i.e. reuse
// `args.newData`
// `delete` reuse data before deletion, i.e. use `args.currentData`
const responseMap = {
  find: 'dbData',
  create: 'newData',
  replace: 'newData',
  delete: 'currentData',
};

module.exports = {
  databaseExecute,
};
