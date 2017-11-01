'use strict';

// Fires operation layer
const fireOperation = function (mInput, nextLayer) {
  return nextLayer(mInput, 'operation');
};

module.exports = {
  fireOperation,
};
