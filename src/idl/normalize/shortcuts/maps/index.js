'use strict';

module.exports = {
  ...require('./read_only'),
  ...require('./user_defaults'),
  ...require('./transform_shortcut'),
  ...require('./aliases'),
  ...require('./models_map'),
};
