'use strict';

module.exports = {
  opts: require('./opts'),
  description: require('./description'),
  ...require('./start'),
  ...require('./stop'),
  ...require('./headers'),
  ...require('./payload'),
  ...require('./url'),
  ...require('./method'),
  ...require('./send'),
  ...require('./name'),
  ...require('./ip'),
  ...require('./args'),
  // eslint-disable-next-line import/max-dependencies
  ...require('./status'),
};
