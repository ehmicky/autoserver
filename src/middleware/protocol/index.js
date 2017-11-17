'use strict';

module.exports = {
  ...require('./validation'),
  ...require('./requestid'),
  ...require('./ip'),
  ...require('./origin'),
  ...require('./query_string'),
  ...require('./headers'),
  ...require('./method'),
  ...require('./path'),
  ...require('./protocol_input'),
  ...require('./format_charset'),
  ...require('./payload'),
  ...require('./router'),

  // eslint-disable-next-line import/max-dependencies
  ...require('./rpc'),
};
