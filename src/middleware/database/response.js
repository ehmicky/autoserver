'use strict';

// Retrieves database return value
// Only `find` command use database return value.
// `create`, `patch` and `upsert` assumes database does not modify input,
// i.e. reuse `args.newData`
// `delete` reuse data before deletion, i.e. use `args.currentData`
const getDbResponse = function ({
  dbData,
  args: { currentData, newData },
  command,
}) {
  const dataInput = { dbData, newData, currentData };
  const data = dataInput[RESPONSE_MAP[command]];
  const metadata = {};
  const response = { data, metadata };

  return { response };
};

const RESPONSE_MAP = {
  find: 'dbData',
  create: 'newData',
  upsert: 'newData',
  patch: 'newData',
  delete: 'currentData',
};

module.exports = {
  getDbResponse,
};
