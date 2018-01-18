'use strict';

// List of error reasons.
// Keys are the exception.reason of the exception thrown
// Values are merged to exceptions thrown
// All error reasons and their related status
module.exports = {
  ...require('./success'),
  ...require('./validation'),
  ...require('./authorization'),
  ...require('./route'),
  ...require('./not_found'),
  ...require('./method'),
  ...require('./command'),
  ...require('./response_negotiation'),
  ...require('./timeout'),
  ...require('./conflict'),
  ...require('./no_content_length'),
  ...require('./payload_limit'),
  ...require('./url_limit'),
  ...require('./payload_negotiation'),
  ...require('./config_validation'),
  ...require('./config_runtime'),
  ...require('./format'),
  ...require('./charset'),
  ...require('./protocol'),
  ...require('./rpc'),
  ...require('./database'),
  ...require('./log'),
  ...require('./compress'),
  ...require('./plugin'),
  ...require('./engine'),
  // eslint-disable-next-line import/max-dependencies
  ...require('./unknown'),
};
