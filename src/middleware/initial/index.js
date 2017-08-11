'use strict';

module.exports = {
  ...require('./setup_input'),
  ...require('./error_handler'),
  ...require('./events_reporter'),
  ...require('./performance_event'),
};
