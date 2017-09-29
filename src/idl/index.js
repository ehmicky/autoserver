'use strict';

module.exports = {
  ...require('./load'),
  ...require('./compile'),
  ...require('./runtime_normalize'),
  ...require('./operations'),
};
