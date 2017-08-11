// eslint-disable-next-line filenames/match-regex, filenames/match-exported
'use strict';

const anyEvent = function (payload) {
  //console.log(`Emitted event ${payload.type}`);

  if (payload.type === 'perf') { return; }

  //const jsonPayload = JSON.stringify(payload, null, 2);
  //console.log('Event payload', jsonPayload);
};

module.exports = anyEvent;
