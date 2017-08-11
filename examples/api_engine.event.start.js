// eslint-disable-next-line filenames/match-regex, filenames/match-exported
'use strict';

const startEvent = function (payload) {
  console.log('Start event:\n', payload);
};

module.exports = startEvent;
