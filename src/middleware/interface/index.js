'use strict';


module.exports = Object.assign(
  {},
  require('./convertor'),
  require('./negotiator'),
  require('./validation'),
  require('./execute'),
  require('./merge_modifiers'),
  require('./no_output')
);
