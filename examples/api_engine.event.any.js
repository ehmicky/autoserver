// eslint-disable-next-line filenames/match-regex, filenames/match-exported
'use strict';

// eslint-disable-next-line fp/no-let
let anyEvent = function (payload) {
  // eslint-disable-next-line no-console, no-restricted-globals
  console.log(`Emitted event ${payload.type}`);

  if (payload.type === 'perf') { return; }

  const jsonPayload = JSON.stringify(payload, null, 2);
  // eslint-disable-next-line no-console, no-restricted-globals
  console.log('Event payload', jsonPayload);
};

// This file is for debugging only. Comment this to enable it.
// eslint-disable-next-line fp/no-mutation, no-empty-function
// anyEvent = () => {};

module.exports = anyEvent;
