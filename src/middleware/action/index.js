'use strict';

module.exports = {
  ...require('./input_info'),
  ...require('./validation'),
  ...require('./handle_args'),

  ...require('./execute'),

  ...require('./normalize'),
};
