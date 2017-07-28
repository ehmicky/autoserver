'use strict';

module.exports = Object.assign(
  {},
  require('./setup_input'),
  require('./error_handler'),
  require('./logging_reporter'),
  require('./performance_log'),
);
