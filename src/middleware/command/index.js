'use strict';

module.exports = {
  ...require('./normalize_empty'),
  ...require('./info'),
  ...require('./validation'),
  ...require('./normalization'),
  ...require('./aliases'),
  ...require('./readonly'),
  ...require('./transform'),
  ...require('./user_defaults'),
  ...require('./system_defaults'),
  ...require('./pagination'),

  // eslint-disable-next-line import/max-dependencies
  ...require('./database'),
};
