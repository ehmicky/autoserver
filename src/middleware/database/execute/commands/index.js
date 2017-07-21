'use strict';

module.exports = Object.assign(
  {},
  require('./create'),
  require('./read'),
  require('./update'),
  require('./upsert'),
  require('./delete'),
);
