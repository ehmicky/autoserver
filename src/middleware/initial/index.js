'use strict';

module.exports = Object.assign(
  {},
  require('./setup_input'),
  require('./error_handler'),
  require('./logging_reporter'),
  require('./error_status'),
  require('./performance_log'),
);
