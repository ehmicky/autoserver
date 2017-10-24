'use strict';

module.exports = {
  ...require('./authorization'),
  ...require('./data_validation'),

  ...require('./adapter'),

  ...require('./duplicate_read'),
  ...require('./missing_ids'),
  ...require('./response_validation'),
};
