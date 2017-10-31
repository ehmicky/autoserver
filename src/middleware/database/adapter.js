'use strict';

// Fires adapter layer
const fireAdapter = async function (mInput, nextLayer) {
  // Since adapter layer modifies `args` and `command`, we only want to pick
  // the `response` (`find` command's response)
  const { response } = await nextLayer(mInput);
  return { response };
};

module.exports = {
  fireAdapter,
};
