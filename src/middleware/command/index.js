'use strict';


module.exports = Object.assign(
  {},
  require('./convertor'),
  require('./validation'),
  require('./system_defaults'),
  require('./user_defaults'),
  require('./normalization'),
  require('./transform')
);
