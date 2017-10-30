'use strict';

// Fires adapter layer
const fireAdapter = async function (mInput, nextLayer) {
  // Since adapter layer modifies `args` and `command`, we only want to pick
  // the `dbData` (`find` command's response)
  const { dbData } = await nextLayer(mInput);
  return { dbData };
};

module.exports = {
  fireAdapter,
};
