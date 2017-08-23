'use strict';

module.exports = {
  ...require('./normalize_empty'),
  ...require('./validation'),
  ...require('./normalization'),
  ...require('./aliases'),
  ...require('./readonly'),
  ...require('./transform'),
  ...require('./user_defaults'),
  ...require('./system_defaults'),
  ...require('./pagination'),
  ...require('./database'),
};
