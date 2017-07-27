'use strict';

module.exports = Object.assign(
  {},
  require('./start'),
  require('./stop'),
  require('./headers'),
  require('./payload'),
  require('./url'),
  require('./method'),
  require('./send'),
  require('./name'),
  require('./ip'),
  require('./settings'),
  // eslint-disable-next-line import/max-dependencies
  require('./status'),
);
