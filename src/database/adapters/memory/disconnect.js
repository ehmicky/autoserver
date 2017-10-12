'use strict';

const { generic } = require('../../../formats');

// Stops connection
// Persist back to file, unless database adapter option `save` is false
const disconnect = async function ({
  options: {
    save,
    data: { path = defaultPath },
  },
  connection,
}) {
  if (save === false) { return; }

  // Reuse the same file that was used during loading
  await generic.save({ path, content: connection });
};

const defaultPath = './api_engine.run.db.memory.json';

module.exports = {
  disconnect,
};
