'use strict';

// Retrieves database return value
// Only `find` command use database return value.
// `create` and `replace` assumes database does not modify input, i.e. reuse
// `args.newData`
// `delete` reuse data before deletion, i.e. use `args.currentData`
const getDbResponse = function ({
  dbData,
  args: { currentData, newData },
  command,
}) {
  const dataInput = { dbData, newData, currentData };
  const data = dataInput[RESPONSE_MAP[command]];
  const response = { data };

  return { response };
};

const RESPONSE_MAP = {
  find: 'dbData',
  create: 'newData',
  replace: 'newData',
  patch: 'newData',
  delete: 'currentData',
};

module.exports = {
  getDbResponse,
};
