'use strict';

module.exports = {
  ...require('./validation'),
  ...require('./name'),
  ...require('./request_id'),
  ...require('./ip'),
  ...require('./url'),
  ...require('./method'),
  ...require('./query_string'),
  ...require('./payload'),
  ...require('./headers'),
  ...require('./settings_params'),
  ...require('./routing'),

  // eslint-disable-next-line import/max-dependencies
  ...require('./operation'),
};
