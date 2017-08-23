'use strict';

module.exports = {
  ...require('./validation'),
  ...require('./handle_args'),

  ...require('./execute'),

  ...require('./normalize'),
};
