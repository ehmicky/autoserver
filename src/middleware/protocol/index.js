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
  ...require('./content_negotiation'),
  ...require('./payload'),
  ...require('./normalize'),
  ...require('./router'),

  // eslint-disable-next-line import/max-dependencies
  ...require('./rpc'),
};
