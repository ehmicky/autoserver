'use strict';

module.exports = {
  ...require('./top'),
  ...require('./validate_args'),
  ...require('./rename_args'),
  ...require('./filter'),
  ...require('./data_arg'),
  ...require('./cascade'),
  ...require('./order'),
  ...require('./parse_select'),
  ...require('./unknown_attrs'),
  ...require('./stable_ids'),
  ...require('./summary'),
  ...require('./sort'),

  ...require('./current_data'),
  ...require('./patch_data'),
  ...require('./resolve'),
  ...require('./rollback'),

  ...require('./remove_nested_write'),
  ...require('./modelscount'),
  ...require('./assemble'),
  ...require('./apply_select'),
  ...require('./parse_response'),
  // eslint-disable-next-line import/max-dependencies
  ...require('./validation_out'),
};
