'use strict';


module.exports = Object.assign(
  {},
  require('./convertor'),
  require('./validation'),
  require('./normalization'),
  require('./aliases'),
  require('./read_only'),
  require('./transform'),
  require('./user_defaults'),
  require('./system_defaults'),
);
