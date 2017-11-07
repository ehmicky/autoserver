'use strict';

// Fire actions, unless the response is already known
const fireActions = function ({ response, mInput }, nextLayer) {
  // When the rpc parser already returned the response,
  // e.g. with GraphQL introspection queries
  if (response) { return; }

  return nextLayer(mInput, 'action');
};

module.exports = {
  fireActions,
};
