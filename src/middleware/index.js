'use strict';


module.exports = Object.assign(
  {},
  require('./error_handler'),
  require('./protocol_negotiator'),
  require('./response'),
  require('./get_path'),
  require('./timestamp'),
  require('./ip'),
  require('./routing'),
  require('./logger'),
  require('./params'),
  require('./interface_convertor'),
  require('./interface_negotiator'),
  require('./custom_jsl'),
  require('./interface'),
  require('./api_convertor'),
  require('./basic_validation'),
  require('./normalization'),
  require('./system_defaults'),
  require('./clean_delete'),
  require('./read_only'),
  require('./transform'),
  require('./filter'),
  require('./validation'),
  require('./database')
);
