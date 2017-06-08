'use strict';


module.exports = Object.assign(
  {},
  require('./convertor'),
  require('./validation'),
  require('./normalization'),
  require('./read_only'),
  require('./user_defaults'),
  require('./system_defaults'),
  require('./transform')
);
