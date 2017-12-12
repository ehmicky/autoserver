'use strict';

module.exports = {
  ...require('./top'),
  ...require('./validate_args'),
  ...require('./rename_args'),
  ...require('./server_params'),
  ...require('./filter'),
  ...require('./data_arg'),
  ...require('./populate_cascade'),
  ...require('./order'),
  ...require('./select'),
  ...require('./rename'),
  ...require('./limits'),
  ...require('./unknown_attrs'),
  ...require('./stable_ids'),
  ...require('./summary'),
  ...require('./client_names'),
  ...require('./sort'),

  ...require('./current_data'),
  ...require('./patch_data'),
  ...require('./resolve'),
  ...require('./rollback'),

  ...require('./modelscount'),
  ...require('./assemble'),
  ...require('./parse_response'),
  // eslint-disable-next-line import/max-dependencies
  ...require('./validation_out'),
};
