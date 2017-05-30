'use strict';


module.exports = Object.assign(
  {},
  require('./convertor'),
  require('./negotiator'),
  require('./validation'),
  require('./error_handler'),
  require('./response'),
  require('./status'),
  require('./path'),
  require('./timestamp'),
  require('./ip'),
  require('./params'),
  require('./routing'),
  require('./protocol_args'),
  require('./logger')
);
