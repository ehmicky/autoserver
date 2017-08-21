'use strict';

const { pick } = require('../../utilities');

// Apply `runOpts.eventFilter`
const applyEventFilter = function ({ eventFilter, obj }) {
  if (eventFilter === undefined || eventFilter === true) { return obj; }

  if (eventFilter === false) { return; }

  return pick(obj, eventFilter);
};

module.exports = {
  applyEventFilter,
};
