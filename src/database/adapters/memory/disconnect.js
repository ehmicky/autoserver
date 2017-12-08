'use strict';

const { saveFile } = require('../../../formats');
const { getRef } = require('../../../json_refs');

// Stops connection
// Persist back to file, unless database adapter option `save` is false
const disconnect = async function ({ options: { save, data }, connection }) {
  if (!save) { return; }

  // Reuse the same file that was used during loading
  const path = getRef(data);
  await saveFile({ type: 'conf', path, content: connection });
};

module.exports = {
  disconnect,
};
