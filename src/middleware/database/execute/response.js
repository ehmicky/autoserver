'use strict';

// Only `find` command use database return value.
// `create` and `replace` assumes database does not modify input, i.e. reuse
// `args.newData`
// `delete` reuse data before deletion, i.e. use `args.currentData`
const getResponse = function ({
  dbData,
  args: { currentData, newData },
  command,
}) {
  const dataInput = { dbData, newData, currentData };
  const data = dataInput[responseMap[command]];

  return { data };
};

const responseMap = {
  find: 'dbData',
  create: 'newData',
  replace: 'newData',
  delete: 'currentData',
};

module.exports = {
  getResponse,
};
