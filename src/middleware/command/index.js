'use strict';


module.exports = Object.assign(
  {},
  require('./convertor'),
  require('./validation'),
  require('./error_handler'),
  require('./system_defaults'),
  require('./user_defaults'),
  require('./normalization'),
  require('./clean_delete'),
  require('./transform')
);
