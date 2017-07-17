'use strict';

module.exports = Object.assign(
  {},
  require('./convertor'),
  require('./validation'),
  require('./handle_args'),
  require('./execute')
);
