'use strict';

module.exports = {
  ...require('./top_action'),
  ...require('./normalize'),
  ...require('./models'),
  ...require('./validate_args'),
  ...require('./rename_args'),
  ...require('./data_arg'),
  ...require('./cascade'),
  ...require('./order_by'),
  ...require('./unknown_attrs'),
  ...require('./operation_summary'),
  ...require('./sort_actions'),

  ...require('./current_data'),
  ...require('./patch_data'),
  ...require('./write_actions'),
  ...require('./read_actions'),

  ...require('./remove_nested_write'),
  ...require('./duplicate_results'),
  ...require('./sort_results'),
  ...require('./models_count'),
  ...require('./assemble'),
  ...require('./select'),
  ...require('./parse_response'),
  // eslint-disable-next-line import/max-dependencies
  ...require('./validation_out'),
};
