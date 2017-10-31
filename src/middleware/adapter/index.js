'use strict';

module.exports = {
  ...require('./pick_adapter'),
  ...require('./rename_ids'),

  ...require('./execute'),
};
