'use strict';

module.exports = {
  ...require('./create'),
  ...require('./read'),
  ...require('./update'),
  ...require('./upsert'),
  ...require('./delete'),
};
