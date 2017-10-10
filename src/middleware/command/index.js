'use strict';

module.exports = {
  ...require('./kind'),
  ...require('./normalize_empty'),
  ...require('./aliases'),
  ...require('./readonly'),
  ...require('./transform'),
  ...require('./user_defaults'),
  ...require('./system_defaults'),
  ...require('./pagination'),
  ...require('./database'),
};
