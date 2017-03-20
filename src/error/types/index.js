'use strict';


module.exports = Object.assign(
  {},
  require('./middleware_error'),
  require('./protocol_error'),
  require('./parsing_error')
);