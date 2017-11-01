'use strict';

// Fires database layer
const fireDatabase = function (mInput, nextLayer) {
  return nextLayer(mInput, 'database');
};

module.exports = {
  fireDatabase,
};
