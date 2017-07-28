'use strict';

module.exports = {
  ...require('./find'),
  ...require('./delete'),
  ...require('./update'),
  ...require('./create'),
  ...require('./replace'),
  ...require('./upsert'),
};
