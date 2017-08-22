'use strict';

// Fires operation layer
const fireOperation = function (input, nextLayer) {
  return nextLayer(input);
};

module.exports = {
  fireOperation,
};
