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
  ...require('./protocol_args'),
  ...require('./router'),

  // eslint-disable-next-line import/max-dependencies
  ...require('./operation'),
};
