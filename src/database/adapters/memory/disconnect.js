'use strict';

const { generic } = require('../../../formats');

// Stops connection
// Persist back to file, unless database adapter option `save` is false
const disconnect = async function ({
  options: {
    save,
    data: { path = DEFAULT_PATH },
  },
  connection,
}) {
  if (!save) { return; }

  // Reuse the same file that was used during loading
  await generic.save({ path, content: connection });
};

const DEFAULT_PATH = './apiengine.run.db.memory.json';

module.exports = {
  disconnect,
};
