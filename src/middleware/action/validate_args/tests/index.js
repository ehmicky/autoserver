'use strict';

module.exports = {
  ...require('./select'),
  ...require('./filter'),
  ...require('./order'),
  ...require('./pagination'),
  ...require('./data'),
  ...require('./populate'),
  ...require('./cascade'),
  ...require('./dryrun'),
  ...require('./silent'),
  ...require('./params'),
  ...require('./required'),
  // eslint-disable-next-line import/max-dependencies
  ...require('./unknown'),
};
