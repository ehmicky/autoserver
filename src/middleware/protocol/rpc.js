'use strict';

// Fires rpc layer
const fireRpc = function (mInput, nextLayer) {
  return nextLayer(mInput, 'rpc');
};

module.exports = {
  fireRpc,
};
