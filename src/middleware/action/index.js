'use strict';

module.exports = {
  ...require('./input_info'),
  ...require('./output_info'),
  ...require('./normalize'),
  ...require('./validation'),
  ...require('./handle_args'),
  ...require('./execute'),
  ...require('./normalize_empty'),
};
