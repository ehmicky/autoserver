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
  require('./params'),
  require('./path'),
  require('./routing'),
  require('./protocol_args'),
  require('./logger')
);
