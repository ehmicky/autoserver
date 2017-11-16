'use strict';

module.exports = {
  ...require('./validation'),
  ...require('./requestid'),
  ...require('./ip'),
  ...require('./protocol_input'),
  ...require('./origin'),
  ...require('./query_string'),
  ...require('./format_charset'),
  ...require('./payload'),
  ...require('./headers'),
  ...require('./method'),
  ...require('./path'),
  ...require('./router'),

  // eslint-disable-next-line import/max-dependencies
  ...require('./rpc'),
};
