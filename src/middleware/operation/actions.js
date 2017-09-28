'use strict';

// Fire actions, unless the response is already known
const fireActions = function ({ response, mInput }, nextLayer) {
  if (response) { return; }

  return nextLayer(mInput);
};

module.exports = {
  fireActions,
};
