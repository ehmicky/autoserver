'use strict';

// Fire actions, unless the response is already known
const fireActions = function ({ response, mInput }, nextLayer) {
  if (response) {
    return alreadyHandled(mInput);
  }

  return nextLayer(mInput, 'action');
};

// When the operation parser already returned the response,
// e.g. with GraphQL introspection queries
const alreadyHandled = function ({ protocolArgs }) {
  return { topargs: protocolArgs };
};

module.exports = {
  fireActions,
};
