'use strict';


module.exports = Object.assign(
  {},
  require('./update_action'),
  require('./upsert_action'),
  require('./replace_action'),
  require('./create_action'),
  require('./find_action'),
  require('./delete_action')
);
