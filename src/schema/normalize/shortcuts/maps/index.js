'use strict';

module.exports = {
  ...require('./readonly'),
  ...require('./user_defaults'),
  ...require('./transform_shortcut'),
  ...require('./aliases'),
  ...require('./models_map'),
  ...require('./validate'),
  ...require('./allowed_commands'),
};
