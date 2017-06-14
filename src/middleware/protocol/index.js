'use strict';


module.exports = Object.assign(
  {},
  require('./convertor'),
  require('./negotiator'),
  require('./validation'),
  require('./response'),
  require('./status'),
  require('./response_time'),
  require('./timestamp'),
  require('./request_id'),
  require('./ip'),
  require('./url'),
  require('./method'),
  require('./query_string'),
  require('./headers'),
  require('./payload'),
  require('./settings'),
  require('./params'),
  require('./routing'),
  require('./logger')
);
