'use strict';

module.exports = {
  ...require('./validation'),
  ...require('./requestid'),
  ...require('./ip'),
  ...require('./url'),
  ...require('./router'),
  ...require('./method'),
  ...require('./query_string'),
  ...require('./headers'),
  ...require('./protocol_input'),
  ...require('./format_charset'),
  ...require('./payload'),

  // eslint-disable-next-line import/max-dependencies
  ...require('./rpc'),
};
