'use strict';


module.exports = Object.assign(
  {},
  require('./connect_to_promise'),
  require('./console'),
  require('./fake_request'),
  require('./error'),
  require('./is_dev')
);
