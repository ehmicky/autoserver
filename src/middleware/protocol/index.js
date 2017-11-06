'use strict';

module.exports = {
  ...require('./validation'),
  ...require('./requestid'),
  ...require('./ip'),
  ...require('./url'),
  ...require('./router'),
  ...require('./method'),
  ...require('./query_string'),
  ...require('./payload'),
  ...require('./headers'),
  ...require('./protocol_args'),
  ...require('./params_args'),

  // eslint-disable-next-line import/max-dependencies
  ...require('./operation'),
};
