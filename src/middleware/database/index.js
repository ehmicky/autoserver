'use strict';

module.exports = {
  ...require('./authorize'),
  ...require('./features'),
  ...require('./data_validation'),

  ...require('./adapter'),

  ...require('./response_validation'),
  ...require('./empty_models'),
  ...require('./duplicate_read'),
  ...require('./missing_ids'),
  ...require('./create_ids'),
};
