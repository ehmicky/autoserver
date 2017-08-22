'use strict';

// Fires database layer
const fireDatabase = function (input, nextLayer) {
  return nextLayer(input);
};

module.exports = {
  fireDatabase,
};
