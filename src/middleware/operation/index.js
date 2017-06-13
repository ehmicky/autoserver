'use strict';


module.exports = Object.assign(
  {},
  require('./convertor'),
  require('./negotiator'),
  require('./validation'),
  require('./no_output'),
  require('./execute'),
  require('./handle_args'),
);
