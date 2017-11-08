'use strict';

module.exports = {
  ...require('./top'),
  ...require('./validate_args'),
  ...require('./rename_args'),
  ...require('./filter'),
  ...require('./data_arg'),
  ...require('./populate_cascade'),
  ...require('./order'),
  ...require('./select'),
  ...require('./unknown_attrs'),
  ...require('./stable_ids'),
  ...require('./summary'),
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
