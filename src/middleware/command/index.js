'use strict';


module.exports = Object.assign(
  {},
  require('./convertor'),
  require('./validation'),
  require('./normalization'),
  require('./user_defaults'),
  require('./system_defaults'),
  require('./transform')
);
