'use strict';

// Fires database layer
const fireDatabase = async function (mInput, nextLayer) {
  // Since adapter layer modifies `args` and `command`, we only want to pick
  // the `response` (`find` command's response)
  const { response } = await nextLayer(mInput, 'database');
  return { response };
};

module.exports = {
  fireDatabase,
};
