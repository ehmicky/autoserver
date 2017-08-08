'use strict';

module.exports = {
  ...require('./convertor'),
  ...require('./validation'),
  ...require('./handle_args'),
  ...require('./execute'),
  ...require('./normalize_empty'),
};
