'use strict';

const { addGenErrorHandler } = require('../../../errors');
const { getByExt } = require('../../../formats');
const { getRef } = require('../../../json_refs');

// Stops connection
// Persist back to file, unless database adapter option `save` is false
const disconnect = async function ({ options: { save, data }, connection }) {
  if (!save) { return; }

  // Reuse the same file that was used during loading
  const path = getRef(data);
  const format = eGetByExt({ path });

  await format.serializeFile(path, connection);
};

const eGetByExt = addGenErrorHandler(getByExt, {
  message: ({ path }) =>
    `Memory database file format is not supported: '${path}'`,
  reason: 'CONFIG_RUNTIME',
});

module.exports = {
  disconnect,
};
