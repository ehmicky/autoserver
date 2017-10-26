'use strict';

module.exports = {
  ...require('./authorization'),
  ...require('./authorize'),
  ...require('./data_validation'),

  ...require('./adapter'),

  ...require('./empty_models'),
  ...require('./duplicate_read'),
  ...require('./missing_ids'),
  ...require('./response_validation'),
};
