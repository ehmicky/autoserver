'use strict';

module.exports = Object.assign(
  {},
  require('./find'),
  require('./delete'),
  require('./update'),
  require('./create'),
  require('./replace'),
  require('./upsert'),
);
